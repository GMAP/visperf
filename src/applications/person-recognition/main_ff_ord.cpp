
/** Includes: **/
#include <iostream>
#include <fstream>
#include <cstdlib>
#include <chrono>
#include "../src/defs.h"

#include <deque>

#include "opencv2/imgproc/imgproc.hpp"
#include "opencv2/highgui/highgui.hpp"
#include "opencv2/opencv.hpp"

#include "ff/farm.hpp"
#include <vector>

using namespace std;
using namespace cv;

#ifdef ENABLE_UPL
    #include <upl.h> 
#endif

void read_training_set(const string &list_path, vector<Mat> &images) {
    ifstream file(list_path.c_str());
    string path;
    while (getline(file, path)) {
        images.push_back(imread(path, CV_LOAD_IMAGE_GRAYSCALE));
    }
}

struct task_data {

    task_data(Mat _m, int _c, int __c) : m(_m), nframe(_c), chunk_id(__c) {}
    task_data(task_data * task) : m(task->m), nframe(task->nframe) , chunk_id(task->chunk_id) {}
    Mat m;
    int nframe;
    int chunk_id;
};

unsigned int order_id, current_id;

class first_filter : public ff::ff_node_t<task_data> {
    VideoCapture fr;
    int c;
public:
    first_filter(VideoCapture f) : fr(f), c(0) {}
    task_data* svc(task_data*){
        while(1){
            Mat m;
            fr >> m;
            if(m.empty()) return EOS;
            ++c;
            task_data * task = new task_data(m,c,order_id);
            ++order_id;
            ff_send_out(task);
        }
    }
};

class middle_filter : public ff::ff_node_t<task_data> {
    Ptr<FaceRecognizer> model;
    Size _faceSize;
public:
    middle_filter(Ptr<FaceRecognizer> m, Size s) : model(m), _faceSize(s) {}
    task_data* svc(task_data* task){
            
        //detect faces in the image:
        vector<Rect> faces;

        CascadeClassifier _cascade;
        _cascade.load(string(CASCADE_PATH));

        Mat tmp;
        int width  = task->m.size().width,
            height = task->m.size().height;
        Size minScaleSize = Size(DET_MIN_SIZE_RATIO  * width, DET_MIN_SIZE_RATIO  * height),
             maxScaleSize = Size(DET_MAX_SIZE_RATIO  * width, DET_MAX_SIZE_RATIO  * height);
        
        //convert the image to grayscale and normalize histogram:
        cvtColor(task->m, tmp, CV_BGR2GRAY);
        equalizeHist(tmp, tmp);
        
        //clear the vector:
        faces.clear();
        
        //detect faces:
        _cascade.detectMultiScale(tmp, faces, DET_SCALE_FACTOR, DET_MIN_NEIGHBORS, 0, minScaleSize, maxScaleSize);
        
        bool has_match = false;
        double match_conf = 0;
        
        //analyze each detected face:
        int index = 0;
        for (vector<Rect>::const_iterator face = faces.begin() ; face != faces.end() ; face++, index++){
            Scalar color = NO_MATCH_COLOR;
            Mat face_img = task->m(*face);
            double confidence = 0;
            bool face_match = false;
            
            //try to recognize the face:
            Ptr<FaceRecognizer> _model = model;
            Mat gray;
            int label;
            Mat aux = task->m(faces[index]);
            cvtColor(aux, gray, CV_BGR2GRAY);
            resize(gray, gray, _faceSize);
            _model->predict(gray, label, confidence);

            bool verify;
            label == 10 ? verify = true : verify = false;
            
            if (verify){
                color = MATCH_COLOR;
                has_match = true;
                face_match = true;
                match_conf = confidence;
            }
            
            Point center(face->x + face->width * 0.5, face->y + face->height * 0.5);
            circle(task->m, center, FACE_RADIUS_RATIO * face->width, color, CIRCLE_THICKNESS, LINE_TYPE, 0);
            
        }
        
        //write some information on the frame:
        putText(task->m, format("Frame: %d", task->nframe), cvPoint(10, task->m.rows - 105),
                FONT, 2, FONT_COLOR, 1, LINE_TYPE);
        putText(task->m, format("FPS: %d", 15), cvPoint(10, task->m.rows - 80),
                FONT, 2, FONT_COLOR, 1, LINE_TYPE);
        putText(task->m, format("Faces: %d", faces.size()), cvPoint(10, task->m.rows - 55),
                FONT, 2, FONT_COLOR, 1, LINE_TYPE);
        putText(task->m, format("Match: %s", has_match ? "True" : "False"), cvPoint(10, task->m.rows - 30),
                FONT, 2, FONT_COLOR, 1, LINE_TYPE);
        putText(task->m, format("Confidence: %f", has_match ? match_conf : 0), cvPoint(10, task->m.rows - 5),
                FONT, 2, FONT_COLOR, 1, LINE_TYPE);

        return task;
    }
};

class last_filter : public ff::ff_node_t<task_data> {
    VideoWriter fw;
#ifdef USE_DEQUE
    std::deque<task_data*> OutputBuffer;
#else
    std::vector<task_data*> OutputBuffer;
#endif
public:
    last_filter(VideoWriter f) : fw(f){}
    task_data* svc(task_data* task){
        #ifdef USE_DEQUE
        while(1){
            //Check if this is not the chunk we were expecting.
            if(task->chunk_id != current_id){
                if(OutputBuffer.empty()){
                    OutputBuffer.push_back(task);
                    return GO_ON;
                }

                std::deque<task_data*>::iterator it;

                unsigned int index = 0;
                for(it = OutputBuffer.begin(); it < OutputBuffer.end(); it++, index++){
                    if(OutputBuffer[index]->chunk_id > task->chunk_id){
                        //Placing it in order.
                        OutputBuffer.emplace(it,task);
                        return GO_ON;
                    }
                }
                if(it != OutputBuffer.end()) return GO_ON;
                //There is one element which comes before the current task.
                OutputBuffer.push_back(task);
                return GO_ON;
            }

            fw.write(task->m);
            ++current_id;

            if(OutputBuffer.empty() || (current_id < OutputBuffer.front()->chunk_id ) ) {delete task; return GO_ON;}

            task = OutputBuffer.front();
            OutputBuffer.pop_front();
        }
        #else
        while(1){
            //Check if this is not the chunk we were expecting.
            if(task->chunk_id != current_id){
                //Make sure the OutputBuffer is large enough.
                if(task->chunk_id >= OutputBuffer.size()){
                    int newsize = task->chunk_id*2;
                    OutputBuffer.resize(newsize,NULL);
                }
                //Save it in the right position.
                OutputBuffer[task->chunk_id] = task;
                return GO_ON;
            }

            fw.write(task->m);
            task->m.release();
            ++current_id;

            if(current_id >= OutputBuffer.size() || !OutputBuffer[current_id]) return GO_ON;

            task = OutputBuffer[current_id];
            OutputBuffer[current_id] = NULL;
        } 
        #endif
    }
};
//Globals:

int main(int argc, char** argv) {

    if(argc != 3){
        printf("./binary input_video nthreads\n");
        return -1;
    }

    order_id = current_id = 0;

    int nthreads = atoi(argv[2]); 
    
    setNumThreads(0); //Disabling internal OpenCV's support for multithreading. 
            
    #ifdef ENABLE_UPL
        int fd_cache;
        if(UPL_init_cache_miss_monitoring(&fd_cache) == 0){
            std::cout << "Error when UPL_init_cache_miss_monitoring(...)" << std::endl;
        }
        
        int *rapl_fd = new int[4];
        if(UPL_init_count_rapl(rapl_fd) == 0){
            std::cout << "Error when UPL_init_count_rapl(...)" << std::endl;
        }
    #endif
    
    auto tstart = std::chrono::high_resolution_clock::now();

    cv::VideoCapture fr;
    fr.open(argv[1]);

    cv::VideoWriter fw;
    cv::Size frame_size(static_cast<int>(fr.get(CV_CAP_PROP_FRAME_WIDTH)), static_cast<int>(fr.get(CV_CAP_PROP_FRAME_HEIGHT)));
    fw.open(string(OUT_VID), OUT_FOURCC, OUT_FPS, frame_size, true);


    /** Initializations: **/
    vector<Mat>  training_set;
    int nframe = 0;
    
    read_training_set(string(TRAINING_LIST), training_set);
    //PersonRecognizer pr(training_set, LBPH_RADIUS, LBPH_NEIGHBORS, LBPH_GRID_X, LBPH_GRID_Y, LBPH_THRESHOLD);

    Ptr<FaceRecognizer> model;
    Size _faceSize;

    //all images are faces of the same person, so initialize the same label for all.
    vector<int> labels(training_set.size());
    for (vector<int>::iterator it = labels.begin() ; it != labels.end() ; *(it++) = 10);
    _faceSize = Size(training_set[0].size().width, training_set[0].size().height);
    
    //build recognizer model:
    model = createLBPHFaceRecognizer(LBPH_RADIUS, LBPH_NEIGHBORS, LBPH_GRID_X, LBPH_GRID_Y, LBPH_THRESHOLD);
    model->train(training_set, labels);


    std::vector<unique_ptr<ff::ff_node>> workers;
    for(int i=0; i < nthreads; i++){
        workers.push_back(std::make_unique<middle_filter>(model,_faceSize));
    }
    ff::ff_Farm<task_data> farm(move(workers));
    first_filter E(fr);
    farm.add_emitter(E);
    last_filter C(fw);
    farm.add_collector(C);
    
    if(farm.run_and_wait_end()<0){
        cout << "error running farm";
    }

    auto tend = std::chrono::high_resolution_clock::now();
    double TT = std::chrono::duration<double>(tend-tstart).count();
    cout << "Time(seconds): " << TT << endl;

    #ifdef ENABLE_UPL
        //UPL metrics
        UPL_print_default_metrics();
        long long r_cache = UPL_get_cache_miss(fd_cache);
        if(r_cache < 0){
            std::cout << "Error when UPL_get_cache_miss(...)" << std::endl;
        }
        std::cout << "UPLib -> Total cache-miss(KB): " << r_cache << std::endl;

        if(UPL_finalize_count_rapl(rapl_fd) == 0){
            std::cout << "Error when UPL_finalize_count_rapl(...)" << std::endl;
        }
        delete rapl_fd;
    #endif
    
    return 0;
}


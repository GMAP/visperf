#include <metrics.hpp>
#include <person_recognition.hpp>
#include <ff/ff.hpp>
#include <mutex>
#include <unistd.h>
#include <sys/syscall.h>
#include <vector>
#include <string>
#define gettid() syscall(SYS_gettid)

using namespace ff;


std::mutex _mutex;
vector<string> tids;

void print_tid(std::string id) {
    int tid = gettid();
    _mutex.lock();
    tids.push_back("TID: " + id + "," + to_string(tid));
    _mutex.unlock();
}

struct Emitter: ff_node_t<Item>{

    int svc_init() {
        print_tid("emitter");
        return 0;
    }

	Item * svc(Item * task){
		while (1){
			Item * item = new Item();
			if (!source_op(*item)) break;
		    ff_send_out(item);
		}
		return EOS;
	}
};

struct Worker: ff_node_t<Item>{

    int svc_init() {
        print_tid("worker");
        return 0;
    }

	Item * svc(Item * item){
		//detect faces in the image:
		detect_op(*item);

		//analyze each detected face:
		recognize_op(*item);
		return item;
	}
};

struct Collector: ff_node_t<Item>{

    int svc_init() {
        print_tid("collector");
        return 0;
    }

	Item * svc(Item * item){
		sink_op(*item);
		return GO_ON;
	}
}Collector;

int main (int argc, char* argv[]){
	//Disabling internal OpenCV's support for multithreading.
	setNumThreads(0);

	init_bench(argc, argv);

	//data_metrics metrics = init_metrics(); //UPL and throughput

	vector<unique_ptr<ff_node>> workers;

	for(int i=0; i<nthreads; i++){
		workers.push_back(make_unique<Worker>());
	}

	ff_OFarm<Item> farm(move(workers));

	Emitter E;
	farm.add_emitter(E);
	farm.add_collector(Collector);

	farm.set_scheduling_ondemand();

	if(farm.run_and_wait_end()<0){
		cout << "error running pipe";
	}

	//stop_metrics(metrics);

	end_bench();

    for (vector<string>::iterator it = tids.begin(); it != tids.end(); it++) {
        cout << *it << endl;
    }

	return 0;
}


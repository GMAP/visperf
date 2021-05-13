#include <ff/ff.hpp>
#include <iostream>
#include <vector>
using namespace ff;

bool use_mapping = true;
int emitter_core = 1;
int worker_core = 5;
int collector_core = 11;

class Worker : public ff_node {
  public:
    int svc_init() {
        if (!use_mapping) {
            return 0;
        }
        if (ff_mapThreadToCpu(worker_core) != 0) {
            printf("Cannot map Worker to CPU %d\n", worker_core);
        }
        return 0;
    }

    void *svc(void *task) {
        int *t = (int *)task;
        std::cout << "Worker " << ff_node::get_my_id() << " (" << ff_getMyCore()
                  << ")"
                  << " received task " << *t << "\n";
        return task;
    }
};

class Collector : public ff_node {
  public:
    int svc_init() {
        if (!use_mapping) {
            return 0;
        }
        if (ff_mapThreadToCpu(collector_core) != 0) {
            printf("Cannot map Collector to CPU %d\n", collector_core);
        }
        return 0;
    }

    void *svc(void *task) {
        int *t = (int *)task;
        if (*t == -1) {
            return NULL;
        }
        return task;
    }
};

class Emitter : public ff_node {
  public:
    Emitter(int max_task) : ntask(max_task){};

    int svc_init() {
        if (!use_mapping) {
            return 0;
        }
        if (ff_mapThreadToCpu(emitter_core) != 0) {
            printf("Cannot map Emitter to CPU %d\n", emitter_core);
        }
        return 0;
    }

    void *svc(void *) {
        int *task = new int(ntask);
        --ntask;
        if (ntask < 0) {
            return NULL;
        }
        return task;
    }

  private:
    int ntask;
};

int main(int argc, char *argv[]) {
    int number_workers = 1;
    int stream_length = 10;

    if (argc > 1) {
        if (argc != 3) {
            std::cerr << "Use: " << argv[0]
                      << " number_workers stream_length\n";
            return -1;
        }
        number_workers = atoi(argv[1]);
        stream_length = atoi(argv[2]);
    }

    if (!number_workers || !stream_length) {
        std::cerr << "Wrong parameters values\n";
        return -1;
    }

    ff_farm farm(false, number_workers, number_workers, false, 32, true);

    Emitter E(stream_length);
    farm.add_emitter(&E);

    std::vector<ff_node *> w;
    for (int i = 0; i < number_workers; ++i) {
        w.push_back(new Worker);
    }
    farm.add_workers(w);

    Collector C;
    farm.add_collector(&C);

    if (farm.run_and_wait_end() < 0) {
        error("Running farm\n");
        return -1;
    }
    std::cerr << "DONE, time= " << farm.ffTime() << " (ms)\n";
    /* farm.ffStats(std::cerr); */

    return 0;
}

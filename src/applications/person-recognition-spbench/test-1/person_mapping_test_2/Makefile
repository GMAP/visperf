COMPILER=g++ -std=c++1y
PKG=`pkg-config --cflags --libs opencv`
FLAGS=-O3 -g -fno-omit-frame-pointer
INCLUDES=  -I /home/claudioscheer/Projects/SPBench/libs/fastflow/  -I /home/claudioscheer/Projects/SPBench/libs/opencv/opencv-2.4.13.6/include/ -I /home/claudioscheer/Projects/SPBench/sys/apps/person_recognition/ -I /home/claudioscheer/Projects/SPBench/libs/bench_metrics/ -I /home/claudioscheer/Projects/SPBench/libs/upl/include/upl/
LIBS=-lpthread   -L /home/claudioscheer/Projects/SPBench/libs/upl/lib/ -lupl
MACRO=-DBLOCKING_MODE -DNO_DEFAULT_MAPPING

all: person_mapping_test_2

person_mapping_test_2: person_mapping_test_2.cpp
	$(COMPILER) $(FLAGS) $(INCLUDES)  $^ -o /home/claudioscheer/Projects/SPBench/bin/person_recognition/fastflow/person_mapping_test_2  $(PKG) $(LIBS) $(MACRO)

clean:
	rm -f /home/claudioscheer/Projects/SPBench/bin/person_recognition/fastflow/person_mapping_test_2

COMPILER=g++ -std=c++1y
PKG=`pkg-config --cflags --libs opencv`
FLAGS=-O3 -g -fno-omit-frame-pointer
INCLUDES=  -I /home/claudioscheer/Projects/SPBench/libs/fastflow/  -I /home/claudioscheer/Projects/SPBench/libs/opencv/opencv-2.4.13.6/include/ -I /home/claudioscheer/Projects/SPBench/sys/apps/person_recognition/ -I /home/claudioscheer/Projects/SPBench/libs/bench_metrics/ -I /home/claudioscheer/Projects/SPBench/libs/upl/include/upl/
LIBS=-lpthread   -L /home/claudioscheer/Projects/SPBench/libs/upl/lib/ -lupl
MACRO=-DBLOCKING_MODE -DMAPPING_STRING=\"0,2,4,6,8,10,1,3,5,7,9,11,12,14,16,18,20,22,13,15,17,19,21,23\"

all: person_mapping_test_1

person_mapping_test_1: person_mapping_test_1.cpp
	$(COMPILER) $(FLAGS) $(INCLUDES)  $^ -o /home/claudioscheer/Projects/SPBench/bin/person_recognition/fastflow/person_mapping_test_1  $(PKG) $(LIBS) $(MACRO)

clean:
	rm -f /home/claudioscheer/Projects/SPBench/bin/person_recognition/fastflow/person_mapping_test_1

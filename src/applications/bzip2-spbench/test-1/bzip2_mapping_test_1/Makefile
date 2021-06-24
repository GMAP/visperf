COMPILER=g++ -std=c++1y
PKG=
FLAGS=-O3 -finline-functions
INCLUDES=  -I /home/claudioscheer/Projects/SPBench/libs/bzlib/include/ -I /home/claudioscheer/Projects/SPBench/libs/fastflow/  -I /home/claudioscheer/Projects/SPBench/sys/apps/bzip2/ -I /home/claudioscheer/Projects/SPBench/libs/bench_metrics/ -I /home/claudioscheer/Projects/SPBench/libs/upl/include/upl/
LIBS=-L /home/claudioscheer/Projects/SPBench/libs/bzlib/lib/ -lbz2 -lpthread   -L /home/claudioscheer/Projects/SPBench/libs/upl/lib/ -lupl
MACRO=-DNO_CMAKE_CONFIG -D_LARGEFILE64_SOURCE -D_FILE_OFFSET_BITS=64 -DBLOCKING_MODE -DMAPPING_STRING=\"0,2,4,6,8,10,1,3,5,7,9,11,12,14,16,18,20,22,13,15,17,19,21,23\"

all: bzip2_mapping_test_1

bzip2_mapping_test_1: bzip2_mapping_test_1.cpp
	$(COMPILER) $(FLAGS) $(INCLUDES)  $^ -o /home/claudioscheer/Projects/SPBench/bin/bzip2/fastflow/bzip2_mapping_test_1  $(PKG) $(LIBS) $(MACRO)

clean:
	rm -f /home/claudioscheer/Projects/SPBench/bin/bzip2/fastflow/bzip2_mapping_test_1

COMPILER=g++ -std=c++1y
PKG=
FLAGS=-O3 -finline-functions
INCLUDES=  -I /home/claudioscheer/Projects/SPBench/libs/bzlib/include/ -I /home/claudioscheer/Projects/SPBench/libs/fastflow/  -I /home/claudioscheer/Projects/SPBench/sys/apps/bzip2/ -I /home/claudioscheer/Projects/SPBench/libs/bench_metrics/ -I /home/claudioscheer/Projects/SPBench/libs/upl/include/upl/
LIBS=-L /home/claudioscheer/Projects/SPBench/libs/bzlib/lib/ -lbz2 -lpthread   -L /home/claudioscheer/Projects/SPBench/libs/upl/lib/ -lupl
MACRO=-DNO_CMAKE_CONFIG -D_LARGEFILE64_SOURCE -D_FILE_OFFSET_BITS=64 -DBLOCKING_MODE -DNO_DEFAULT_MAPPING

all: bzip2_mapping_test_2

bzip2_mapping_test_2: bzip2_mapping_test_2.cpp
	$(COMPILER) $(FLAGS) $(INCLUDES)  $^ -o /home/claudioscheer/Projects/SPBench/bin/bzip2/fastflow/bzip2_mapping_test_2  $(PKG) $(LIBS) $(MACRO)

clean:
	rm -f /home/claudioscheer/Projects/SPBench/bin/bzip2/fastflow/bzip2_mapping_test_2

events=cpu-cycles,instructions,cache-misses,cache-references,L1-dcache-load-misses,L1-dcache-loads,L1-dcache-stores,L1-icache-load-misses,LLC-loads,LLC-load-misses,LLC-stores,mem-loads,mem-stores,branch-misses,branch-instructions,bus-cycles

default:
	sh scripts/build.sh

test-1: default
	./build/ff-farm 24 1000000

record-test-1-97: default
	sudo perf record --delay 0 --sample-cpu -g --call-graph dwarf --freq 97 --period --running-time --all-user --timestamp --output data/perf-record-1.data --event ${events} -- ./build/ff-farm 24 1000000

record-test-1-997: default
	sudo perf record --delay 0 --sample-cpu -g --call-graph dwarf --freq 997 --period --running-time --all-user --timestamp --output data/perf-record-1.data --event ${events} -- ./build/ff-farm 24 1000000
	# sudo perf script --max-stack 5 --show-info --input data/perf-record-1.data > data/perf-record-1.txt
	# sudo chown water:water data/perf-record-1.txt data/perf-record-1.data

test-2: default
	./build/ff-farm 24 5000000

record-test-2: default
	sudo perf record --delay 0 --sample-cpu -g --call-graph dwarf --freq 997 --period --running-time --all-user --timestamp --output data/perf-record-2.data --event ${events} -- ./build/ff-farm 24 5000000
	# sudo perf script --max-stack 5 --show-info --input data/perf-record-2.data > data/perf-record-2.txt
	# sudo chown water:water data/perf-record-2.txt data/perf-record-2.data

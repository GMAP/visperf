events = cpu-cycles,instructions,cache-misses,cache-references,L1-dcache-load-misses,L1-dcache-loads,L1-dcache-stores,L1-icache-load-misses,LLC-loads,LLC-load-misses,LLC-stores,mem-loads,mem-stores,branch-misses,branch-instructions

default:
	sh scripts/build.sh

run-perf-test-1: default
	@# Using cores 1, 4 and 9.
	sudo perf stat --no-metric-only --all-cpus --no-aggr --interval-print 75 --output data/perf-test-1.csv --field-separator "," --event ${events} -- ./build/ff-farm 12 500000

run-perf-test-2: default
	@# Using all cores.
	sudo perf stat --no-metric-only --all-cpus --no-aggr --interval-print 75 --output data/perf-test-2.csv --field-separator "," --event ${events} -- ./build/ff-farm 12 500000

record: default
	sudo perf record -D 0 --timestamp --sample-cpu --raw-samples -g --call-graph dwarf -F 97 --period --raw-samples --running-time --all-user --timestamp -s -o data/perf-record.data -e ${events} -- ./build/ff-farm 12 1000000
	sudo perf script --show-info -i data/perf-record.data > data/perf-record.txt
	sudo chown water:water data/perf-record.txt

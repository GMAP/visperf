events = cpu-cycles,instructions,cache-misses,cache-references,L1-dcache-load-misses,L1-dcache-loads,L1-dcache-stores,L1-icache-load-misses,LLC-loads,LLC-load-misses,LLC-stores,mem-loads,mem-stores,branch-misses,branch-instructions,power:cpu_idle,power:cpu_frequency

default:
	sh scripts/build.sh

run-perf-test-1: default
	sudo perf stat --all-cpus --no-aggr --interval-print 50 --output data/perf-test-1.csv --field-separator "," --event cpu-cycles,cache-misses,instructions,cycle_activity.cycles_l3_miss --no-inherit -- ./build/matrix-multiplication

run-perf-test-2: default
	sudo perf stat --all-cpus --no-aggr --interval-print 50 --output data/perf-test-2.csv --field-separator "," --event cpu-cycles,cache-misses,instructions,cycle_activity.cycles_l3_miss --no-inherit -- ./build/matrix-multiplication

record: default
	sudo perf record -D 0 --timestamp --sample-cpu --call-graph dwarf -F 5 -P -o data/perf-record-1000.data -e ${events} -- ./build/matrix-multiplication
	sudo perf script -i data/perf-record-1000.data > data/perf-record-1000.txt
	sudo perf report -i data/perf-record-1000.data -T --header > data/perf-report.txt
	sudo chown water:water data/perf-record-1000.txt data/perf-report.txt

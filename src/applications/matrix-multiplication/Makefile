default:
	sh scripts/build.sh

run-perf-test-1: default
	sudo perf stat --all-cpus --no-aggr --interval-print 50 --output data/perf-test-1.csv --field-separator "," --event cpu-cycles,cache-misses,instructions,cycle_activity.cycles_l3_miss --no-inherit -- ./build/matrix-multiplication

run-perf-test-2: default
	sudo perf stat --all-cpus --no-aggr --interval-print 50 --output data/perf-test-2.csv --field-separator "," --event cpu-cycles,cache-misses,instructions,cycle_activity.cycles_l3_miss --no-inherit -- ./build/matrix-multiplication

record: default
	sudo perf record -D 0 -T --call-graph dwarf -F 997 -P --all-user -o data/perf-record-1000.data -- ./build/matrix-multiplication
	sudo perf script -i data/perf-record-1000.data > data/perf-record-1000.txt
	sudo perf report -i data/perf-record-1000.data -T --header > data/perf-report.txt
	sudo chown water:water data/perf-record-1000.txt data/perf-report.txt

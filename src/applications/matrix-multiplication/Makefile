default:
	sh scripts/build.sh

record: default
	sudo perf record -D 0 -T --call-graph dwarf -F 997 -P --all-user -o data/perf-record-1000.data -e cpu-cycles,cache-misses,instructions,cycle_activity.cycles_l3_miss -- ./build/matrix-multiplication
	sudo perf script -i data/perf-record-1000.data > data/perf-record-1000.txt
	sudo chown water:water data/perf-record-1000.txt

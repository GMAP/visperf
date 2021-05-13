default:
	sh scripts/build.sh

run-perf-test-1: default
	# Using cores 1, 5 and 11.
	sudo perf stat --all-cpus --no-aggr --interval-print 50 --output data/perf-test-1.csv --field-separator "," --event cpu-cycles,cache-misses,instructions,cycle_activity.cycles_l3_miss -- ./build/ff-farm 12 2000000

run-perf-test-2: default
	# Using cores 9, 10 and 11.
	sudo perf stat --all-cpus --no-aggr --interval-print 50 --output data/perf-test-2.csv --field-separator "," --event cpu-cycles,cache-misses,instructions,cycle_activity.cycles_l3_miss -- ./build/ff-farm 12 2000000

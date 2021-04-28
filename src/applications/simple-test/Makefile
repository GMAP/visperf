default:
	sh scripts/build.sh

run-perf-test-1: default
	# Using cores 1, 5 and 11.
	sudo perf stat -a -I 100 -o data/perf-test-1.csv -x "," -e cpu-cycles,cache-misses,instructions,cycle_activity.cycles_l3_miss -C 1,5,11 -- ./build/ff-farm 12 2000000

run-perf-test-2: default
	# Using cores 9, 10 and 11.
	sudo perf stat -a -I 100 -o data/perf-test-2.csv -x "," -e cpu-cycles,cache-misses,instructions,cycle_activity.cycles_l3_miss -C 9,10,11 -- ./build/ff-farm 12 1000000

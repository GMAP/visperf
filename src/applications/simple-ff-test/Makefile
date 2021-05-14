events = cpu-cycles,instructions,cache-misses,cache-references,L1-dcache-load-misses,L1-dcache-loads,L1-dcache-stores,L1-icache-load-misses,LLC-loads,LLC-load-misses,LLC-stores,LLC-store-misses,mem-loads,mem-stores

default:
	sh scripts/build.sh

run-perf-test-1: default
	# Using cores 1, 4 and 9.
	sudo perf stat --all-cpus --no-aggr --interval-print 50 --output data/perf-test-1.csv --field-separator "," --event ${events} -- ./build/ff-farm 12 5000000

run-perf-test-2: default
	# Using all cores.
	sudo perf stat --all-cpus --no-aggr --interval-print 50 --output data/perf-test-2.csv --field-separator "," --event ${events} -- ./build/ff-farm 12 5000000

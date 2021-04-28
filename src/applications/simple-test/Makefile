default:
	sh scripts/build.sh

run-perf-test-1: default
	# To capture cores individually, use --per-core.
	sudo perf stat -a -I 100 -o data/perf-test-1.csv -x "," -e cpu-cycles,cache-misses,instructions -- ./build/ff-farm 12 1000000

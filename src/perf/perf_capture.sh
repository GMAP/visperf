#!/bin/bash

CLEAR='\033[0m'
RED='\033[0;31m'

function usage() {
    if [ -n "$1" ]; then
        echo -e "${RED}$1${CLEAR}\n";
    fi
    echo "Usage: $0 [-n experiment-name] [-r runs] [-o output-directory] [-c command]"
    echo "  -n, --name               Experiment name."
    echo "  -r, --runs               Number of times experiment will run."
    echo "  -o, --output             Directory where perf logs will be saved."
    echo "  -c, --command            Command that triggers the experiment."
    echo ""
    echo "Example: $0 --name \"Experiment XX\" --runs 5 --output ./output/experiment-xx/ -c \"sleep 10\""
    exit 1
}

# Parse params.
while [[ "$#" > 0 ]]; do case $1 in
    -n|--name) EXPERIMENT_NAME="$2"; shift;shift;;
    -r|--runs) RUNS="$2";shift;shift;;
    -o|--output) OUTPUT_DIR="$2";shift;shift;;
    -c|--command) COMMAND="$2";shift;shift;;
    *) usage "Unknown parameter passed: $1"; shift; shift;;
esac; done

# Verify required params.
if [ -z "$EXPERIMENT_NAME" ]; then usage "Experiment name not set."; fi;
if [ -z "$RUNS" ]; then usage "Number of time experiment will run not set."; fi;
if [ -z "$OUTPUT_DIR" ]; then usage "Output directory not set."; fi;
if [ -z "$COMMAND" ]; then usage "Experiment command not set."; fi;

# Setup system.
SUDO="sudo"
if ! [ -x "$(command -v sudo)" ]; then
    SUDO=""
    echo "Running perf without 'sudo'." >&2
fi
mkdir -p $OUTPUT_DIR

PERF_EVENTS=$(cat events.txt | tr "\n" "," | sed "s/,$//")
PERF_CAPTURE_FREQUENCY=997
PERF_MAX_STACK=3
PERF_DELAY_CAPTURE=100

function perf_capture() {
    run=$1
	$SUDO perf record --delay $PERF_DELAY_CAPTURE --sample-cpu -g \
        --call-graph dwarf --freq $PERF_CAPTURE_FREQUENCY --period \
        --running-time --all-user --timestamp \
        --output $OUTPUT_DIR/$run.data \
        --event ${PERF_EVENTS} -- \
        $COMMAND
    perf_data_to_txt $run
}

function perf_data_to_txt() {
    run=$1
	$SUDO perf script --max-stack $PERF_MAX_STACK --show-info --input \
        $OUTPUT_DIR/$run.data > $OUTPUT_DIR/$run.txt
    $SUDO chown $(whoami):$(whoami) $OUTPUT_DIR/$run.txt $OUTPUT_DIR/$run.data
}

JSON="\"$EXPERIMENT_NAME\": {\"title\": \"$EXPERIMENT_NAME\","

JSON_RUNS='"runs": ['
# Run experiment.
for ((run = 0; run < $RUNS; run++)); do
    perf_capture $run > /dev/null
    JSON_RUNS+="{\"title\": \"Run $run\", \"path\": \"$(realpath $OUTPUT_DIR/$run.txt)\"},"
done
# Remove last ",".
JSON_RUNS=${JSON_RUNS::-1}
JSON_RUNS+=']'

JSON+=$JSON_RUNS
JSON+="}"

echo "{$JSON}" | jq . > $OUTPUT_DIR/config.json

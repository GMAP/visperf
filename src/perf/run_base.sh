#!/bin/bash

##### BEGIN - TOUCH ONLY IF YOU KNOW WHAT YOU ARE DOING #####
CPUS=$(nproc)
CPUS_PER_ROW=5
PERF_EVENTS=$(cat events.txt | tr "\n" "," | sed "s/,$//")

JSON_CPUS="\"cpus\": $CPUS"

JSON_CPU_SETUP="\"cpu_setup\": ["
for ((i = 0; i < $(echo "$(($CPUS / $CPUS_PER_ROW))"); i++)); do
    JSON_CPU_SETUP+="["
    for ((j = 0; j < $CPUS_PER_ROW; j++)); do
        JSON_CPU_SETUP+="0,"
    done
    JSON_CPU_SETUP=${JSON_CPU_SETUP::-1}
    JSON_CPU_SETUP+="],"
done
if [ $(echo "$(($CPUS % $CPUS_PER_ROW))") -gt 0 ]; then
    JSON_CPU_SETUP+="["
    for ((i = 0; i < $CPUS_PER_ROW; i++)); do
        JSON_CPU_SETUP+="0,"
    done
    JSON_CPU_SETUP=${JSON_CPU_SETUP::-1}
    JSON_CPU_SETUP+="]"
else
    # Remove last ",".
    JSON_CPU_SETUP=${JSON_CPU_SETUP::-1}
fi
JSON_CPU_SETUP+="]"

JSON_EVENTS_CAPTURED="\"events_captured\": ["
JSON_EVENTS_CAPTURED+=$(awk '{print "\""$0"\","}' events.txt)
JSON_EVENTS_CAPTURED=${JSON_EVENTS_CAPTURED::-1}
JSON_EVENTS_CAPTURED+="]"
##### END - TOUCH ONLY IF YOU KNOW WHAT YOU ARE DOING #####



OUTPUT_CONFIG_LOCATION=./config.json
OUTPUT_EXPERIMENTS_PARSED_LOCATION=./experiments.json

# Put here all the output directories of your experiments.
EXPERIMENTS_OUTPUT=()

# Example of how to capture perf events from experiments.
#./perf_capture.sh --name "Experiment 1" --runs 5 --output ./data/experiment-1 --command "sleep 5"
#EXPERIMENTS_OUTPUT+=(./data/experiment-1)

#./perf_capture.sh --name "Experiment 2" --runs 5 --output ./data/experiment-2 --command "sleep 5"
#EXPERIMENTS_OUTPUT+=(./data/experiment-2)



##### BEGIN - TOUCH ONLY IF YOU KNOW WHAT YOU ARE DOING #####
JSON_EXPERIMENTS_OUTPUT="\"experiments\": {"
for output in "${EXPERIMENTS_OUTPUT[@]}"; do
    config=$(cat $output/config.json)
    config=${config:1:-1}
    JSON_EXPERIMENTS_OUTPUT+=$config
    JSON_EXPERIMENTS_OUTPUT+=","
done
JSON_EXPERIMENTS_OUTPUT=${JSON_EXPERIMENTS_OUTPUT::-1}
JSON_EXPERIMENTS_OUTPUT+="}"
echo "{$JSON_CPUS,$JSON_CPU_SETUP,$JSON_EVENTS_CAPTURED,$JSON_EXPERIMENTS_OUTPUT}" | jq . > $OUTPUT_CONFIG_LOCATION
##### END - TOUCH ONLY IF YOU KNOW WHAT YOU ARE DOING #####



# Comment this line to not parse the config file generated.
python3 parser/parser.py --input $OUTPUT_CONFIG_LOCATION --output $OUTPUT_EXPERIMENTS_PARSED_LOCATION

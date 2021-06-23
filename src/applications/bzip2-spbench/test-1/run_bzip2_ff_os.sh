#!/bin/bash

#############################################################
##### BEGIN - TOUCH ONLY IF YOU KNOW WHAT YOU ARE DOING #####
#############################################################
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
###########################################################
##### END - TOUCH ONLY IF YOU KNOW WHAT YOU ARE DOING #####
###########################################################


OUTPUT_CONFIG_LOCATION=./bzip2-logs/output/config.json
OUTPUT_EXPERIMENTS_PARSED_LOCATION=./bzip2-logs/output/experiments.json


####################################
##### BEGIN - SETUP EXPERIMENT #####
####################################
CURRENT_DIR=$(pwd)

mkdir -p ./bzip2-logs/output

source /home/claudioscheer/Projects/SPBench/libs/bzlib/setup_bzlib_vars.sh

cd /home/claudioscheer/Projects/SPBench
./spbench compile -version bzip2_mapping_test_1
./spbench compile -version bzip2_mapping_test_2

# Here you can navigate to the folder you want.

cd $CURRENT_DIR
##################################
##### END - SETUP EXPERIMENT #####
##################################


##################################
##### BEGIN - RUN EXPERIMENT #####
##################################

# Put here all the output directories of your experiments.
EXPERIMENTS_OUTPUT=()

n=24
for ((i = $n; i >= 1; i--)); do
    ./perf_capture.sh --name "bzip2 ($i) - FF mapping" --runs 2 --output ./bzip2-logs/ff/experiment-mapping-$i --command "source /home/claudioscheer/Projects/SPBench/libs/bzlib/setup_bzlib_vars.sh && cd /home/claudioscheer/Projects/SPBench && ./spbench exec -version bzip2_mapping_test_1 -input ./inputs/bzip2/FC-6-x86_64-disc1.iso -nthreads $i"
    EXPERIMENTS_OUTPUT+=(./bzip2-logs/ff/experiment-mapping-$i)

    ./perf_capture.sh --name "bzip2 ($i) - OS mapping" --runs 2 --output ./bzip2-logs/os/experiment-mapping-$i --command "source /home/claudioscheer/Projects/SPBench/libs/bzlib/setup_bzlib_vars.sh && cd /home/claudioscheer/Projects/SPBench && ./spbench exec -version bzip2_mapping_test_2 -input ./inputs/bzip2/FC-6-x86_64-disc1.iso -nthreads $i"
    EXPERIMENTS_OUTPUT+=(./bzip2-logs/os/experiment-mapping-$i)
done

################################
##### END - RUN EXPERIMENT #####
################################


#############################################################
##### BEGIN - TOUCH ONLY IF YOU KNOW WHAT YOU ARE DOING #####
#############################################################
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
###########################################################
##### END - TOUCH ONLY IF YOU KNOW WHAT YOU ARE DOING #####
###########################################################


# Comment this line to avoid parsing perf output.
python3 parser/parser.py --input $OUTPUT_CONFIG_LOCATION --output $OUTPUT_EXPERIMENTS_PARSED_LOCATION

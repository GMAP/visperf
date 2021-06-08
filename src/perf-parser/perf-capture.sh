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

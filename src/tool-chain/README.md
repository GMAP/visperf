## Requirements

- Python 3;
- jq (check [here](https://github.com/stedolan/jq) the project);
- Perf:

```bash
sudo apt-get install linux-tools-common linux-tools-generic linux-tools-`uname -r`
```

## Project Documentation

Next, we document the project structure.

- [run-base](run-base.sh): provides a skeleton of how your experiments should be structured. The file is well documented and provides freedom to fully customize the experiments;
- [perf-capture](perf-capture.sh): profiles the application using `perf record`, convert the file to TXT using `perf script`, and convert the file to CSV, reducing storage space required;

```bash
Usage: ./perf-capture.sh [-n experiment-name] [-r runs] [-f frequency] [-o output-directory] [-c command]
  -n, --name               Experiment name.
  -r, --runs               Number of times experiment will run.
  -f, --frequency          Number of samples to capture per second. Default: 997 samples/second.
  -o, --output             Directory where perf logs will be saved.
  -c, --command            Command that triggers the experiment.

Example: ./perf-capture.sh --name "Experiment XX" --runs 5 --frequency 997 --output ./output/experiment-xx -c "sleep 10"
```

- [events.txt](events.txt): defines which events `perf record` will monitor. We can see the events available on your architecture using `perf list`;
- [parser/perf_script2csv.py](parser/perf_script2csv.py): parse data from TXT to CSV;

```bash
python3 parser/perf_script2csv.py --input data.txt
```

You can see an example of the TXT file [here](test/exp-1-run-1.txt) and an example of CSV file [here](test/exp-1-run-1.csv).

- [parser/parser.py](parser/parser.py): creates the JSON file to be uploaded in the VisPerf visualization dashboard;

```bash
python3 parser/parser.py --input config.json --output experiments.json
```

You can see an example of the `config.json` file [here](test/config.json) and an example of the `experiments.json` file [here](test/experiments.json).

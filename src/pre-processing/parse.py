import argparse
import pandas as pd
import numpy as np
import copy
import json
from viscpu import perf_record


parser = argparse.ArgumentParser(description="Parse perf data.")
parser.add_argument(
    "-i",
    "--input",
    type=str,
    help="JSON file with experiments to be parsed.",
    required=True,
)
parser.add_argument(
    "-o",
    "--output",
    type=str,
    help="JSON file to be used in the web interface.",
    required=True,
)

args = vars(parser.parse_args())


def write_json_file(file, data):
    with open(file, mode="w") as f:
        json.dump(data, f)


def read_json_file(file):
    with open(file) as f:
        return json.load(f)


def process_df(df):
    df["time"] = df["time"] - df["time"].min()
    df["time_second"] = df["time"].apply(lambda x: int(x))
    df = (
        df.groupby(["time_second", "tid", "event", "cpu"])
        .agg({"counter": "sum", "time": "mean", "stack": perf_record.agg_stack})
        .reset_index()
    )
    return df


def process_run(run_path, data):
    csv_path = run_path.replace(".txt", ".csv")
    perf_record.parse_record_dataset(run_path, csv_path)

    df = pd.read_csv(csv_path)
    df = process_df(df)

    run = {}
    run["time_series"] = {}
    run["cpu"] = {}
    run["search_function_threads"] = {}
    run["functions"] = {"time_series": {}}
    run["threads"] = {"time_series": {}}

    for event in data["events_captured"]:
        times, captures = perf_record.get_event_data(df, data["cpu_setup"], event)
        run["time_series"][event] = {"times": times, "captures": captures}

        df_aggr = df[(df["event"] == event)].groupby(["cpu"], as_index=False)["counter"]
        a = perf_record.transform_cpu_data(df_aggr.mean(), data["cpu_setup"])
        a_sum = np.sum(a)
        run["cpu"][event] = {
            "mean": a,
            "mean_relative": a
            if a_sum <= 0
            else ((np.array(a) / a_sum) * 100).tolist(),
        }

        run["search_function_threads"][
            event
        ] = perf_record.get_search_functions_threads(df, event)

        run["functions"]["time_series"][event] = {}
        run["threads"]["time_series"][event] = {}
        for time in df["time_second"].unique().tolist():
            functions, threads = perf_record.get_unique_functions_threads(
                df, event, time
            )
            run["functions"]["time_series"][event][time] = functions
            run["threads"]["time_series"][event][time] = threads

    return run


def process_experiment(experiment, data):
    runs = copy.deepcopy(experiment["runs"])
    experiment["runs"] = {}
    for run in runs:
        experiment["runs"][run["title"]] = process_run(run["path"], data)
    return experiment["runs"]


def get_experiments_to_compare(experiments):
    for k, v in experiments.items():
        for run in v["runs"]:
            yield {
                "text": f"{v['title']} - {run['title']}",
                "value": {"experiment": k, "run": run["title"]},
            }


if __name__ == "__main__":
    input_file = read_json_file(args["input"])
    output = {
        "cpu_setup": input_file["cpu_setup"],
        "cpu_labels": perf_record.cpu_labels(
            input_file["cpu_setup"], len(input_file["cpu_setup"][0])
        ),
        "events_captured": sorted(input_file["events_captured"], key=str.casefold),
        "experiments_to_compare": [
            x for x in get_experiments_to_compare(input_file["experiments"])
        ],
        "experiments": {},
    }

    for k, v in input_file["experiments"].items():
        output["experiments"][k] = process_experiment(v, output)

    write_json_file(args["output"], output)

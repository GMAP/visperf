import argparse
import pandas as pd
import numpy as np
import copy
import json
import perf_record_helper as perf_record
import concurrent.futures


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

    df_cpu = (
        df[
            (
                df["event"].isin(
                    [
                        "L1-dcache-load-misses",
                        "LLC-load-misses",
                        "instructions",
                        "cpu-cycles",
                        "bus-cycles",
                    ]
                )
            )
        ]
        .groupby(["cpu", "event"])
        .agg({"counter": "sum"})
        .reset_index()
    )
    run["ipc_performance"] = {
        "cpu": perf_record.transform_cpu_data(
            df_cpu,
            data["cpu_setup"],
            func_metric=lambda df: get_counter_value(df, "instructions", 0)
            / get_counter_value(df, "cpu-cycles", 1),
        ),
        "time_series": {},
    }
    run["l1_cache_performance"] = {
        "cpu": perf_record.transform_cpu_data(
            df_cpu,
            data["cpu_setup"],
            func_metric=lambda df: get_counter_value(df, "L1-dcache-load-misses", 0)
            / get_counter_value(df, "instructions", 1),
        ),
        "time_series": {},
    }
    run["llc_cache_performance"] = {
        "cpu": perf_record.transform_cpu_data(
            df_cpu,
            data["cpu_setup"],
            func_metric=lambda df: get_counter_value(df, "LLC-load-misses", 0)
            / get_counter_value(df, "instructions", 1),
        ),
        "time_series": {},
    }
    run["bus_performance"] = {
        "cpu": perf_record.transform_cpu_data(
            df_cpu,
            data["cpu_setup"],
            func_metric=lambda df: get_counter_value(df, "bus-cycles", 0)
            / get_counter_value(df, "cpu-cycles", 1),
        ),
        "time_series": {},
    }
    for time in df["time_second"].unique().tolist():
        df_filtered = (
            df[
                (df["time_second"] == time)
                & (
                    df["event"].isin(
                        [
                            "L1-dcache-load-misses",
                            "LLC-load-misses",
                            "instructions",
                            "cpu-cycles",
                            "bus-cycles",
                        ]
                    )
                )
            ]
            .groupby(["event"])
            .agg({"counter": "sum"})
            .reset_index()
        )

        run["ipc_performance"]["time_series"][time] = get_counter_value(
            df_filtered, "instructions"
        ) / get_counter_value(df_filtered, "cpu-cycles", 1)
        run["l1_cache_performance"]["time_series"][time] = get_counter_value(
            df_filtered, "L1-dcache-load-misses"
        ) / get_counter_value(df_filtered, "instructions", 1)
        run["llc_cache_performance"]["time_series"][time] = get_counter_value(
            df_filtered, "LLC-load-misses"
        ) / get_counter_value(df_filtered, "instructions", 1)
        run["bus_performance"]["time_series"][time] = get_counter_value(
            df_filtered, "bus-cycles"
        ) / get_counter_value(df_filtered, "cpu-cycles", 1)

    return run


def get_counter_value(df, event, default=0):
    df_filtered = df[df["event"] == event]
    if df_filtered.empty:
        return default
    return float(df_filtered["counter"])


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
        "cpus": input_file["cpus"],
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

    with concurrent.futures.ThreadPoolExecutor() as executor:
        futures = [
            (k, executor.submit(process_experiment, v, output))
            for k, v in input_file["experiments"].items()
        ]

        for (k, future) in futures:
            output["experiments"][k] = future.result()

    write_json_file(args["output"], output)

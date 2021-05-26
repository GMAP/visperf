import csv
import math
import copy


def create_cpu_label(cpu):
    return f"CPU{cpu}"


def cpu_labels(cpu_setup, cpus_per_row):
    cpu = []
    for x, setup_row in enumerate(cpu_setup):
        row = []
        for y in range(cpus_per_row):
            row.append(create_cpu_label(x * cpus_per_row + y))
        cpu.append(row)
    return cpu


def get_event_data(df, cpu_setup, event):
    times = df["time_second"].unique().tolist()
    captures = {}
    for t in times:
        df_filtered = df[(df["event"] == event) & (df["time_second"] == t)]
        captures[t] = transform_cpu_data(df_filtered, cpu_setup)
    return (times, captures)


def transform_cpu_data(df, cpu_setup):
    cpu = copy.deepcopy(cpu_setup)
    cpus = df["cpu"].unique().tolist()
    cpus_per_row = len(cpu[0])
    for c in cpus:
        x = math.ceil((c + 1) / cpus_per_row) - 1
        y = c % cpus_per_row
        cpu[x][y] = float(df[df["cpu"] == c]["counter"].values[0])
    return cpu


def parse_event(l):
    return l.replace(":", "")


def parse_thread_id(l):
    return int(l)


def parse_counter(l):
    return int(l)


def parse_time(l):
    return float(l.replace(":", ""))


def parse_cpu(l):
    return l.replace("[", "").replace("]", "")


def parse_info_line(line):
    l = line.split()
    return [
        parse_time(l[3]),
        parse_thread_id(l[1]),
        parse_event(l[5]),
        parse_counter(l[4]),
        parse_cpu(l[2]),
    ]


def get_unique_functions_threads(df, event, time):
    unique_functions = {}
    unique_threads = {}
    for i, row in df[(df["time_second"] == time) & (df["event"] == event)].iterrows():
        cpu = create_cpu_label(row["cpu"])
        if cpu not in unique_threads:
            unique_threads[cpu] = {}
        if cpu not in unique_functions:
            unique_functions[cpu] = {}

        tid = row["tid"]
        unique_threads[cpu][tid] = unique_threads[cpu].get(tid, 0) + row["counter"]

        for function in row["stack"].split("|"):
            if function not in unique_functions[cpu]:
                unique_functions[cpu][function] = (
                    unique_functions[cpu].get(function, 0) + row["counter"]
                )
    return unique_functions, unique_threads


def get_search_functions_threads(df, event):
    unique_functions = {}
    unique_threads = {}
    for i, row in df[(df["event"] == event)].iterrows():
        tid = row["tid"]
        unique_threads[tid] = unique_threads.get(tid, 0) + 1
        functions = row["stack"].split("|")
        for function in functions:
            unique_functions[function] = unique_functions.get(function, 0) + 1

    functions_sorted = [
        dict(text=f"{x[0]} ({x[1]})", value=x[0], type="function")
        for x in sorted(unique_functions.items(), key=lambda x: x[1], reverse=True)
    ]
    threads_sorted = [
        dict(text=f"{x[0]} ({x[1]})", value=x[0], type="thread")
        for x in sorted(unique_threads.items(), key=lambda x: x[1], reverse=True)
    ]
    return functions_sorted + threads_sorted


def agg_stack(stack):
    functions = {}
    for s in stack:
        for f in s.split("|"):
            if f == "[unknown]":
                continue
            if f not in functions:
                functions[f] = 1
            else:
                functions[f] += 1
    return "|".join(functions.keys())


def parse_stack_function(l):
    return l.split("+")[0]


def parse_stack_line(line):
    l = line.split()
    return [parse_stack_function(l[1])]


def parse_lines(lines):
    l = parse_info_line(lines[0])
    stack_functions = []
    for i in range(1, len(lines)):
        stack_functions.append(parse_stack_line(lines[i])[0])
    l.append("|".join(stack_functions))
    return l


def parse_record_dataset(file, csv_output):
    with open(file, "r") as f:
        with open(csv_output, "w") as csv_file:
            csv_writer = csv.writer(
                csv_file, delimiter=",", quotechar='"', quoting=csv.QUOTE_ALL
            )
            csv_writer.writerow(["time", "tid", "event", "counter", "cpu", "stack"])
            lines = []
            for line in f:
                if not line.strip():
                    l = parse_lines(lines)
                    csv_writer.writerow(l)
                    lines = []
                else:
                    lines.append(line)

import copy
import math


def __fill_cpu_setup(df, cpu_setup):
    cpus = df["cpu"].unique()
    cpus_dict = __cpus_to_index(cpus)
    cpus_index = list(cpus_dict.keys())
    cpus_value = list(cpus_dict.values())
    cpus_per_row = len(cpu_setup[0])
    for c in cpus_index:
        x = math.ceil((c + 1) / cpus_per_row) - 1
        y = c % cpus_per_row
        cpu_setup[x][y] = float(
            df[df["cpu"] == cpus_value[c]]["counter_value"].values[0]
        )
    return cpu_setup


def __cpus_to_index(cpus):
    d = {int(x.replace("CPU", "")): x for x in cpus}
    d = dict(sorted(d.items(), key=lambda x: x[0]))
    return d


def transform_cpu_data(df, cpu_setup):
    return __fill_cpu_setup(df, copy.deepcopy(cpu_setup))


def get_event_thread_data(df, cpu_setup, event, thread):
    times = df["time_second"].unique().tolist()
    captures = {}
    for t in times:
        df_filtered = df[
            (df["event"] == event) & (df["time_second"] == t) & (df["tid"] == thread)
        ]
        captures[t] = transform_cpu_data(df_filtered, cpu_setup)
    return (times, captures)


def get_event_data(df, cpu_setup, event):
    times = df["time"].unique()
    captures = {}
    for t in times:
        df_filtered = df[(df["event"] == event) & (df["time"] == t)]
        captures[t] = transform_cpu_data(df_filtered, cpu_setup)
    return (list(times), captures)


def get_cpu_setup(cpus, cpus_per_row):
    cpus_dict = __cpus_to_index(cpus)
    cpus_index = list(cpus_dict.keys())
    cpus_value = list(cpus_dict.values())
    d_rows, i_rows = math.modf(len(cpus_index) / cpus_per_row)

    cpu_labels = []
    cpu_setup = []

    for x in range(int(i_rows)):
        setup = []
        labels = []
        for y in range(cpus_per_row):
            setup.append(0)
            labels.append(cpus_value[y + (x * cpus_per_row)])
        cpu_setup.append(setup)
        cpu_labels.append(labels)

    if d_rows > 0:
        cpu_setup.append([0] * int(len(cpus_index) - (i_rows * cpus_per_row)))
        cpu_labels.append(list(cpus_value[int(i_rows * cpus_per_row) :]))

    return (cpu_labels, cpu_setup)

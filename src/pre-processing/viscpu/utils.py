import copy
import math


def __fill_cpu_setup(df, cpu_setup):
    cpus = df["cpu"].unique()
    cpus_index = __cpus_to_index(cpus)
    cpus_per_row = len(cpu_setup[0])
    for c in cpus_index:
        x = math.ceil((c + 1) / cpus_per_row) - 1
        y = c % cpus_per_row
        cpu_setup[x][y] = float(df[df["cpu"] == cpus[c]]["counter_value"].values[0])
    return cpu_setup


def __cpus_to_index(cpus):
    return [int(x.replace("CPU", "")) for x in cpus]


def get_event_data(df, cpu_setup, event):
    times = df["time"].unique()
    captures = {}
    for t in times:
        df_filtered = df[(df["event"] == event) & (df["time"] == t)]
        captures[t] = __fill_cpu_setup(df_filtered, copy.deepcopy(cpu_setup))
    return (list(times), captures)


def get_cpu_setup(cpus, cpus_per_row):
    cpus_index = __cpus_to_index(cpus)
    d_rows, i_rows = math.modf(len(cpus_index) / cpus_per_row)

    cpu_labels = []
    cpu_setup = []

    for x in range(int(i_rows)):
        setup = []
        labels = []
        for y in range(cpus_per_row):
            setup.append(0)
            labels.append(cpus[y + (x * cpus_per_row)])
        cpu_setup.append(setup)
        cpu_labels.append(labels)

    if d_rows > 0:
        cpu_setup.append([0] * int(len(cpus) - (i_rows * cpus_per_row)))
        cpu_labels.append(list(cpus[int(i_rows * cpus_per_row) :]))

    return (cpu_labels, cpu_setup)

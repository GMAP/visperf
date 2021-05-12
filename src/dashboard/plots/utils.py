import pandas as pd


def closest_time(df: pd.DataFrame, time: float):
    unique_values = df["time"].unique()
    lower_value = min(unique_values)
    greater_value = max(unique_values)
    for x in sorted(unique_values):
        if x > time:
            greater_value = x
            break
        lower_value = x
    return min([lower_value, greater_value], key=lambda x: abs(x - time))


def csv_stat_to_df(csv: open) -> pd.DataFrame:
    df = pd.read_csv(
        csv,
        skiprows=1,
        header=None,
        names=[
            "time",
            "cpu",
            "counter_value",
            "ignore_1",
            "event",
            "ignore_2",
            "ignore_3",
            "ignore_4",
            "ignore_5",
            "ignore_6",
        ],
        usecols=["time", "cpu", "counter_value", "event"],
    )
    df["cpu_index"] = df["cpu"].str.replace("CPU", "")
    return df

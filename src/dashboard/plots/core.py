import plotly.express as px
import pandas as pd
from plotly.graph_objects import Figure
from plots.utils import closest_time


def get_plot(
    df: pd.DataFrame, event: str, cores_setup: list[int], slider_value: float
) -> Figure:
    slider_df = df["time"].iloc[(df["time"] - slider_value).abs().argsort()[:48]]
    print(closest_time(df, slider_value))
    fig = px.imshow([[1, 20, 30], [20, 1, 60], [30, 60, 1]])
    return fig

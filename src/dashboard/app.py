import sys
import json
import argparse
from plots.utils import csv_stat_to_df
from shared import shared_data
from shared.main_dash import app, make_layout

arg_parser = argparse.ArgumentParser()
arg_parser.add_argument(
    "--d1",
    type=open,
    required=True,
    help="Data collected from an experiment.",
)
arg_parser.add_argument(
    "--d2",
    type=open,
    required=True,
    help="Data collected from an experiment, which will be compared to the data set 'd1'.",
)
args = vars(arg_parser.parse_args())

d1 = csv_stat_to_df(args["d1"])
d2 = csv_stat_to_df(args["d2"])
with open("config.json") as f:
    config = json.load(f)

shared_data.d1_global = d1
shared_data.d2_global = d2
shared_data.config_global = config

if __name__ == "__main__":
    app.layout = make_layout()
    app.run_server(debug=True)

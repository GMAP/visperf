from dash.development.base_component import Component
import dash_bootstrap_components as dbc
import dash_core_components as dcc
import dash_html_components as html
import pandas as pd
from plots import core
from dash.dependencies import Input, Output, State
from shared import shared_data, main_dash

# print(main_dash.app)
print(shared_data.d1_global)

# @main.app.callback(
#     Output("memory", "data"), Input("d1-slider", "value"), State("memory", "data")
# )
# def update_d1_slider(value: float, state: dict) -> dict:
#     state["d1-slider-value"] = value
#     print(state, "---------")
#     return state


def get_page(state: dict) -> Component:
    return html.Div(
        [
            html.H2("Plot title"),
            html.P("About the plot."),
            dbc.Row(
                [
                    dbc.Col(
                        [
                            dcc.Graph(
                                id="example-graph-1",
                                figure=core.get_plot(
                                    data.d1,
                                    "cpu-cyles",
                                    data.config["cores_setup"].split(","),
                                    state["d1-slider-value"],
                                ),
                            ),
                            dcc.Slider(
                                id="d1-slider",
                                min=data.d1["time"].min(),
                                max=data.d1["time"].max(),
                                value=0,
                                # marks={str(x): str(x) for x in d1["time"].unique()},
                                updatemode="drag",
                                # step=None,
                                step=0.001,
                            ),
                        ]
                    ),
                    # dbc.Col(
                    #     [
                    #         dcc.Graph(
                    #             id="example-graph-2",
                    #             figure=core.get_plot(
                    #                 d2, "cpu-cyles", config["cores_setup"].split(","), 0
                    #             ),
                    #         ),
                    #         dcc.Slider(
                    #             id="my-slider",
                    #             min=0,
                    #             max=20,
                    #             step=0.5,
                    #             value=10,
                    #         ),
                    #     ]
                    # ),
                ]
            ),
        ],
    )
    return

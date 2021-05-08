import dash_bootstrap_components as dbc
import dash_core_components as dcc
import dash_html_components as html
from plots import test


def get_page():
    return html.Div(
        children=[
            html.P("This is the content of the home page!"),
            dcc.Graph(id="example-graph", figure=test.get_plot()),
        ],
    )
    return

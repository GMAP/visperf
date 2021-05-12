import dash
import dash_bootstrap_components as dbc
import dash_core_components as dcc
import dash_html_components as html
from dash.development.base_component import Component
from dash.dependencies import Input, Output, State
from pages import not_found, home

app = dash.Dash(
    __name__,
    external_stylesheets=[dbc.themes.SKETCHY],
    title="VisCPU",
    suppress_callback_exceptions=True,
)


@app.callback(
    Output("page-content", "children"),
    Input("url", "pathname"),
    State("memory", "data"),
)
def __render_page_content(pathname: str, state: dict) -> Component:
    if pathname == "/":
        return home.get_page(state)

    return not_found.get_page(pathname)


def make_layout():
    style = {
        "marginLeft": "18rem",
        "marginRight": "2rem",
        "padding": "2rem 1rem",
    }
    content = html.Div(id="page-content", style=style)
    layout = html.Div(
        [
            dcc.Store(id="memory", data={"d1-slider-value": 0}),
            dcc.Location(id="url"),
            __make_sidebar(),
            content,
        ]
    )

    return layout


def __make_sidebar():
    style = {
        "position": "fixed",
        "top": 0,
        "left": 0,
        "bottom": 0,
        "width": "16rem",
        "padding": "2rem 1rem",
        "backgroundColor": "#f8f9fa",
    }
    sidebar = html.Div(
        [
            html.H2("VisCPU", className="display-5 text-center"),
            html.Hr(),
            dbc.Nav(
                [
                    dbc.NavLink("CPU cores", href="/", active="exact"),
                    dbc.NavLink("More", href="/more", active="exact"),
                ],
                vertical=True,
                pills=True,
            ),
        ],
        style=style,
    )

    return sidebar

import dash
import dash_bootstrap_components as dbc
import dash_core_components as dcc
import dash_html_components as html
from dash.dependencies import Input, Output
from pages import not_found, cpu_cores

app = dash.Dash(
    __name__,
    external_stylesheets=[dbc.themes.SKETCHY],
    title="VisCPU",
)

SIDEBAR_STYLE = {
    "position": "fixed",
    "top": 0,
    "left": 0,
    "bottom": 0,
    "width": "16rem",
    "padding": "2rem 1rem",
    "backgroundColor": "#f8f9fa",
}

CONTENT_STYLE = {
    "marginLeft": "18rem",
    "marginRight": "2rem",
    "padding": "2rem 1rem",
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
    style=SIDEBAR_STYLE,
)

content = html.Div(id="page-content", style=CONTENT_STYLE)
app.layout = html.Div([dcc.Location(id="url"), sidebar, content])


@app.callback(Output("page-content", "children"), [Input("url", "pathname")])
def render_page_content(pathname):
    if pathname == "/":
        return cpu_cores.get_page()

    return not_found.get_page(pathname)


if __name__ == "__main__":
    app.run_server(debug=True)

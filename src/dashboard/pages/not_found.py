import dash_bootstrap_components as dbc
import dash_html_components as html


def get_page(pathname):
    return dbc.Jumbotron(
        [
            html.H1("404: Not found", className="text-danger"),
            html.Hr(),
            html.P(f"The pathname {pathname} was not recognized..."),
        ]
    )

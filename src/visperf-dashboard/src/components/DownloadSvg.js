import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    container: {
        textAlign: 'center',
    },
    button: {
        fontSize: 12,
        textDecoration: 'underline',
        cursor: 'pointer',
        padding: 0,
        border: 'none',
        background: 'none',
    },
}));

function downloadSvg(svg) {
    if (svg) {
        const link = document.createElement('a');

        const blob = new Blob([svg.current.innerHTML], {
            type: 'image/svg+xml',
        });
        const url = window.URL.createObjectURL(blob);

        link.href = url;
        link.download = 'plot.svg';

        document.body.appendChild(link);

        link.dispatchEvent(
            new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window,
            }),
        );

        document.body.removeChild(link);
    }
}

export default function DownloadSvg(props) {
    const classes = useStyles();
    const { svgNode } = props;

    return (
        <div className={classes.container}>
            <button
                onClick={() => downloadSvg(svgNode)}
                className={classes.button}
            >
                Download
            </button>
        </div>
    );
}

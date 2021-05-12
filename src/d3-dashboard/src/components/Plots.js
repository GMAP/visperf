import React from 'react';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { TestPlot, CorePlot } from '../plots';

const useStyles = makeStyles((theme) => ({
    container: {
        marginTop: theme.spacing(2),
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        paddingTop: theme.spacing(0.5),
        paddingBottom: theme.spacing(2),
    },
}));

function Plot({ children }) {
    const classes = useStyles();

    return (
        <Paper elevation={1} className={classes.container}>
            {children}
        </Paper>
    );
}

export default function Plots({ dataFile }) {
    return (
        <div>
            <Plot>
                <CorePlot
                    // data={[1, 3, 5, 7]}
                    data={[
                        [1, 2, 11, 20],
                        [30, 4, 12],
                        [5, 6, 13],
                        [7, 8, 14],
                    ]}
                />
            </Plot>
            <Plot>
                <TestPlot data={[100, 200, 300, 400, 500]} />
            </Plot>
        </div>
    );
}

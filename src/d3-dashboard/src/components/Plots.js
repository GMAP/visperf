import React from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { CpuPlot } from '../plots';

const useStyles = makeStyles((theme) => ({
    container: {
        marginTop: theme.spacing(2),
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        paddingTop: theme.spacing(0.5),
        paddingBottom: theme.spacing(2),
    },
    description: {
        paddingBottom: theme.spacing(2),
    },
}));

function Plot({ children, title, description }) {
    const classes = useStyles();

    return (
        <Paper elevation={1} className={classes.container}>
            <h1>{title}</h1>
            <p className={classes.description}>{description}</p>
            {children}
        </Paper>
    );
}

export default function Plots({ dataFile }) {
    return (
        <div>
            <Plot
                title="Compare CPU cycles"
                description="This plot compares the CPU cycle used while experiments were running."
            >
                <Grid container spacing={8}>
                    <Grid item sm={6}>
                        <CpuPlot
                            title="Experiment 1"
                            cpuLabels={dataFile['cpu_labels']}
                            data={dataFile['dataset-1']['raw']['cpu-cycles']}
                        />
                    </Grid>
                    <Grid item sm={6}>
                        <CpuPlot
                            title="Experiment 2"
                            cpuLabels={dataFile['cpu_labels']}
                            data={dataFile['dataset-2']['raw']['cpu-cycles']}
                        />
                    </Grid>
                </Grid>
            </Plot>
            <Plot
                title="Compare instructions executed"
                description="This plot compares the number of instructions executed on each CPU during the execution of experiments."
            >
                <Grid container spacing={8}>
                    <Grid item sm={6}>
                        <CpuPlot
                            title="Experiment 1"
                            cpuLabels={dataFile['cpu_labels']}
                            data={dataFile['dataset-1']['raw']['instructions']}
                        />
                    </Grid>
                    <Grid item sm={6}>
                        <CpuPlot
                            title="Experiment 2"
                            cpuLabels={dataFile['cpu_labels']}
                            data={dataFile['dataset-2']['raw']['instructions']}
                        />
                    </Grid>
                </Grid>
            </Plot>
        </div>
    );
}

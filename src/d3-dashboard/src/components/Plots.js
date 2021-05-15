import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { CpuPlot, ParallelCoordinatePlot } from '../plots';
import { ComparisonContainer } from './';
import { flatten2dArray, transposeArrays } from '../utils';

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

function loadComparisonPlot(visualization, dataFile, baseExperiment, event) {
    if (visualization === 'parallel-coordinates') {
        const experiment1 = flatten2dArray(
            dataFile['dataset-1']['aggregated'][event]['mean'],
        );
        const experiment2 = flatten2dArray(
            dataFile['dataset-2']['aggregated'][event]['mean'],
        );
        return (
            <ParallelCoordinatePlot
                margin={{ top: 10, left: 40, bottom: 40, right: 40 }}
                width={600}
                height={60 * dataFile['cpu_labels'].length}
                dimensions={[
                    {
                        name: 'CPU',
                        labels: flatten2dArray(dataFile['cpu_labels']),
                    },
                    {
                        name: 'Experiment 1',
                        hideLabels: false,
                    },
                    { name: 'Experiment 2', hideLabels: false },
                ]}
                timeSeries={false}
                title="Comparison"
                data={transposeArrays([
                    flatten2dArray(dataFile['cpu_labels']).map((_, i) => i),
                    experiment1,
                    experiment2,
                ])}
            />
        );
    } else if (visualization === 'cpus') {
        return (
            <CpuPlot
                margin={5}
                d3ColorScale="interpolateRdBu"
                legendPoints={[0, 50, 100]}
                timeSeries={false}
                title="Comparison"
                cpuLabels={dataFile['cpu_labels']}
                data={dataFile[baseExperiment][event]['mean']}
            />
        );
    }
    return null;
}

export default function Plots({ dataFile }) {
    const [event, setComparisonEvent] = useState(dataFile['events'][0]);
    const [eventTimeSeries, setComparisonEventTimeSeries] = useState(
        dataFile['events'][0],
    );
    const [baseExperiment, setComparisonBaseExperiment] = useState(
        'comparison-1-2',
    );
    const [visualization, setComparisonVisualization] = useState(
        'parallel-coordinates',
    );

    return (
        <div>
            <Plot
                title="Comparison between experiments"
                description="This plot allows you to compare the captured events during experiment execution."
            >
                <ComparisonContainer
                    events={dataFile['events']}
                    setComparisonEvent={(e) => setComparisonEvent(e)}
                    setComparisonBaseExperiment={(e) =>
                        setComparisonBaseExperiment(e)
                    }
                    setComparisonVisualization={(e) =>
                        setComparisonVisualization(e)
                    }
                >
                    <Grid container spacing={8}>
                        <Grid item sm={true}>
                            <CpuPlot
                                margin={5}
                                squareSize={60}
                                timeSeries={false}
                                title="Experiment 1"
                                cpuLabels={dataFile['cpu_labels']}
                                data={
                                    dataFile['dataset-1']['aggregated'][event][
                                        'mean'
                                    ]
                                }
                            />
                        </Grid>
                        <Grid item sm={true}>
                            <CpuPlot
                                margin={5}
                                squareSize={60}
                                timeSeries={false}
                                title="Experiment 2"
                                cpuLabels={dataFile['cpu_labels']}
                                data={
                                    dataFile['dataset-2']['aggregated'][event][
                                        'mean'
                                    ]
                                }
                            />
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item sm={true}>
                            {loadComparisonPlot(
                                visualization,
                                dataFile,
                                baseExperiment,
                                event,
                            )}
                        </Grid>
                    </Grid>
                </ComparisonContainer>
            </Plot>
            <Plot
                title="Compare time series of experiments"
                description="This plot compares the events captured during the execution of the experiments. The slider allows you to see each of the captures made."
            >
                <ComparisonContainer
                    events={dataFile['events']}
                    setComparisonEvent={(e) => setComparisonEventTimeSeries(e)}
                >
                    <Grid container spacing={8}>
                        <Grid item sm={true}>
                            <CpuPlot
                                title="Experiment 1"
                                cpuLabels={dataFile['cpu_labels']}
                                data={
                                    dataFile['dataset-1']['raw'][
                                        eventTimeSeries
                                    ]
                                }
                            />
                        </Grid>
                        <Grid item sm={true}>
                            <CpuPlot
                                title="Experiment 2"
                                cpuLabels={dataFile['cpu_labels']}
                                data={
                                    dataFile['dataset-2']['raw'][
                                        eventTimeSeries
                                    ]
                                }
                            />
                        </Grid>
                    </Grid>
                </ComparisonContainer>
            </Plot>
        </div>
    );
}
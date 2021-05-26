import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { TrendingDown, TrendingUp } from '@material-ui/icons';
import { CpuPlot, ParallelCoordinatePlot } from '../plots';
import { ComparisonContainer, AutocompleteFunctionsThreads } from './';
import { flatten2dArray, transposeArrays } from '../utils';

const useStylesPlot = makeStyles((theme) => ({
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

const useStylesPlots = makeStyles((theme) => ({
    labelValueContainer: {
        marginTop: theme.spacing(3),
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
    },
    labelValue: {
        margin: 'auto',
    },
}));

function Plot({ children, title, description }) {
    const classes = useStylesPlot();

    return (
        <Paper elevation={1} className={classes.container}>
            <h1>{title}</h1>
            <p className={classes.description}>{description}</p>
            {children}
        </Paper>
    );
}

function loadParallelCoordinatesPlot(dataFile, event) {
    const experiment1 = flatten2dArray(
        dataFile['dataset-1']['aggregated'][event]['mean_relative'],
    );
    const experiment2 = flatten2dArray(
        dataFile['dataset-2']['aggregated'][event]['mean_relative'],
    );
    const intersection = flatten2dArray(
        dataFile['comparison-2-1'][event]['mean_relative'],
    );
    return (
        <ParallelCoordinatePlot
            margin={{ top: 10, left: 40, bottom: 40, right: 50 }}
            width={700}
            height={50 * dataFile['cpu_labels'].length}
            dimensions={[
                {
                    name: 'CPU',
                    labels: flatten2dArray(dataFile['cpu_labels']),
                    reverseScale: true,
                },
                {
                    name: 'Experiment 1 (%)',
                    hideLabels: false,
                },
                { name: 'Experiment 2 (%)', hideLabels: false },
                { name: 'Difference (%)', hideLabels: false },
            ]}
            timeSeries={false}
            data={transposeArrays([
                flatten2dArray(dataFile['cpu_labels']).map((_, i) => i),
                experiment1,
                experiment2,
                intersection,
            ])}
        />
    );
}

export default function Plots({ dataFile }) {
    const classes = useStylesPlots();
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
    const [filterFunctionThread1, setFilterFunctionThread1] = useState([]);
    const [filterFunctionThread2, setFilterFunctionThread2] = useState([]);
    const valueResumed = dataFile[baseExperiment][event]['mean_value'];

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
                    {visualization === 'cpus' ? (
                        <Grid container spacing={4}>
                            <Grid item>
                                <CpuPlot
                                    margin={5}
                                    squareSize={45}
                                    fontSize=".9em"
                                    timeSeries={false}
                                    title="Experiment 1"
                                    cpuLabels={dataFile['cpu_labels']}
                                    data={
                                        dataFile['dataset-1']['aggregated'][
                                            event
                                        ]['mean_relative']
                                    }
                                />
                            </Grid>
                            <Grid item>
                                <CpuPlot
                                    margin={5}
                                    squareSize={45}
                                    timeSeries={false}
                                    fontSize=".9em"
                                    title="Experiment 2"
                                    cpuLabels={dataFile['cpu_labels']}
                                    data={
                                        dataFile['dataset-2']['aggregated'][
                                            event
                                        ]['mean_relative']
                                    }
                                />
                            </Grid>
                            <Grid item sm={true}>
                                <CpuPlot
                                    margin={5}
                                    d3ColorScale="interpolateRdBu"
                                    legendPoints={[0, 50, 100]}
                                    legendPositions={[0.02, 0.5, 0.98]}
                                    legendLabels={['∞', '0', '-∞']}
                                    legendInvert={false}
                                    timeSeries={false}
                                    title="Difference"
                                    cpuLabels={dataFile['cpu_labels']}
                                    data={
                                        dataFile[baseExperiment][event][
                                            'mean_relative'
                                        ]
                                    }
                                />
                            </Grid>
                        </Grid>
                    ) : (
                        <Grid container>
                            <Grid item sm={true}>
                                {loadParallelCoordinatesPlot(dataFile, event)}
                            </Grid>
                        </Grid>
                    )}
                    <Grid item sm={12} className={classes.labelValueContainer}>
                        <Grid container>
                            <Grid item className={classes.labelValue}>
                                <h1>
                                    {valueResumed.toFixed(2)}%
                                    &nbsp;&nbsp;&nbsp;
                                    {valueResumed > 0 ? (
                                        <TrendingUp />
                                    ) : valueResumed < 0 ? (
                                        <TrendingDown />
                                    ) : null}
                                </h1>
                            </Grid>
                            <Grid item sm={12}>
                                How the event counter changed between
                                experiments.
                            </Grid>
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
                            <AutocompleteFunctionsThreads
                                id="autocomplete-time-series-dataset-1"
                                data={
                                    dataFile['dataset-1'][
                                        'search_function_threads'
                                    ][eventTimeSeries]
                                }
                                onChangeFilter={(filter) =>
                                    setFilterFunctionThread1(filter)
                                }
                            />

                            <CpuPlot
                                title="Experiment 1"
                                cpuLabels={dataFile['cpu_labels']}
                                data={
                                    dataFile['dataset-1']['raw'][
                                        eventTimeSeries
                                    ]
                                }
                                functions={
                                    dataFile['dataset-1']['functions']['raw'][
                                        eventTimeSeries
                                    ]
                                }
                                threads={
                                    dataFile['dataset-1']['threads']['raw'][
                                        eventTimeSeries
                                    ]
                                }
                                selectedFunctionsThreads={filterFunctionThread1}
                            />
                        </Grid>
                        <Grid item sm={true}>
                            <AutocompleteFunctionsThreads
                                id="autocomplete-time-series-dataset-2"
                                data={
                                    dataFile['dataset-2'][
                                        'search_function_threads'
                                    ][eventTimeSeries]
                                }
                                onChangeFilter={(filter) =>
                                    setFilterFunctionThread2(filter)
                                }
                            />

                            <CpuPlot
                                title="Experiment 2"
                                cpuLabels={dataFile['cpu_labels']}
                                data={
                                    dataFile['dataset-2']['raw'][
                                        eventTimeSeries
                                    ]
                                }
                                functions={
                                    dataFile['dataset-2']['functions']['raw'][
                                        eventTimeSeries
                                    ]
                                }
                                threads={
                                    dataFile['dataset-2']['threads']['raw'][
                                        eventTimeSeries
                                    ]
                                }
                                selectedFunctionsThreads={filterFunctionThread2}
                            />
                        </Grid>
                    </Grid>
                </ComparisonContainer>
            </Plot>
        </div>
    );
}

import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import { TrendingDown, TrendingUp } from '@material-ui/icons';
import { CpuPlot, ParallelCoordinatePlot, AreaPlot } from '../plots';
import { ComparisonContainer, AutocompleteFunctionsThreads } from './';
import { flatten2dArray, transposeArrays, createComparison } from '../utils';

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
    formControl: {
        minWidth: 150,
    },
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
    titleComparisonEvents: {
        textAlign: 'center',
    },
    containerTitleComparisonEvents: {
        paddingBottom: '0 !important',
    },
    containerTitleComparisonEventExperiment: {
        paddingBottom: '0 !important',
        paddingTop: '0 !important',
    },
    titleComparisonEventExperiment: {
        textAlign: 'center',
    },
    selectEventsToCompareContainer: {
        position: 'fixed',
        padding: theme.spacing(2),
        width: 400,
        left: '50%',
        transform: 'translateX(-50%)',
        top: 70,
        backgroundColor: '#FFF',
        zIndex: 10,
    },
    selectEventsToCompare: {
        textAlign: 'center',
        margin: 'unset',
        padding: 'unset',
        marginBottom: -12,
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

function loadParallelCoordinatesPlot(
    dataFile,
    event,
    experiment1Selected,
    experiment2Selected,
    comparison,
) {
    const experiment1 = flatten2dArray(
        dataFile['experiments'][experiment1Selected.experiment][
            experiment1Selected.run
        ]['cpu'][event]['mean_relative'],
    );
    const experiment2 = flatten2dArray(
        dataFile['experiments'][experiment2Selected.experiment][
            experiment2Selected.run
        ]['cpu'][event]['mean_relative'],
    );
    const intersection = flatten2dArray(comparison['mean_relative']);

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

function loadMetricComparisonPlot(metricVisualization, data, xLabel, yLabel) {
    if (metricVisualization === 'area') {
        return (
            <AreaPlot
                xLabel={xLabel}
                yLabel={yLabel}
                data={data['raw']}
                margin={{
                    top: 5,
                    left: 80,
                    rigth: 5,
                    bottom: 60,
                }}
            />
        );
    } else if (metricVisualization === 'cpus') {
        return (
            <CpuPlot
                legendLabels={['∞', '-∞']}
                margin={5}
                squareSize={70}
                fontSize=".9em"
                timeSeries={false}
                cpuLabels={data['cpu'].map((x) =>
                    x.map((y) => Math.round((y + Number.EPSILON) * 100) / 100),
                )}
                data={data['cpu']}
            />
        );
    }
}

function FirstSectionPlots({ dataFile, classes, experiment1, experiment2 }) {
    const [event, setEvent] = useState(dataFile['events_captured'][0]);
    const [visualization, setVisualization] = useState('parallel-coordinates');

    const comparison = createComparison(
        dataFile['experiments'][experiment1.experiment][experiment1.run]['cpu'][
            event
        ]['mean'],
        dataFile['experiments'][experiment2.experiment][experiment2.run]['cpu'][
            event
        ]['mean'],
    );

    const valueResumed = comparison['mean_value'];

    return (
        <Plot
            title="Comparison between experiments"
            description="This plot allows you to compare the captured events during experiment execution."
        >
            <ComparisonContainer
                events={dataFile['events_captured']}
                setComparisonEvent={(e) => setEvent(e)}
                setComparisonVisualization={(e) => setVisualization(e)}
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
                                    dataFile['experiments'][
                                        experiment1.experiment
                                    ][experiment1.run]['cpu'][event][
                                        'mean_relative'
                                    ]
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
                                    dataFile['experiments'][
                                        experiment2.experiment
                                    ][experiment2.run]['cpu'][event][
                                        'mean_relative'
                                    ]
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
                                data={comparison['mean_relative']}
                            />
                        </Grid>
                    </Grid>
                ) : (
                    <Grid container>
                        <Grid item sm={true}>
                            {loadParallelCoordinatesPlot(
                                dataFile,
                                event,
                                experiment1,
                                experiment2,
                                comparison,
                            )}
                        </Grid>
                    </Grid>
                )}
                <Grid item sm={12} className={classes.labelValueContainer}>
                    <Grid container>
                        <Grid item className={classes.labelValue}>
                            <h1>
                                {valueResumed.toFixed(2)}% &nbsp;&nbsp;&nbsp;
                                {valueResumed > 0 ? (
                                    <TrendingUp />
                                ) : valueResumed < 0 ? (
                                    <TrendingDown />
                                ) : null}
                            </h1>
                        </Grid>
                        <Grid item sm={12}>
                            How the event counter changed between experiments.
                        </Grid>
                    </Grid>
                </Grid>
            </ComparisonContainer>
        </Plot>
    );
}

function SecondSectionPlots({ dataFile, experiment1, experiment2 }) {
    const [event, setEvent] = useState(dataFile['events_captured'][0]);
    const [filterFunctionThread1, setFilterFunctionThread1] = useState([]);
    const [filterFunctionThread2, setFilterFunctionThread2] = useState([]);

    return (
        <Plot
            title="Compare time series of experiments"
            description="This plot compares the events captured during the execution of the experiments. The slider allows you to see each of the captures made."
        >
            <ComparisonContainer
                events={dataFile['events_captured']}
                setComparisonEvent={(e) => setEvent(e)}
            >
                <Grid container spacing={8}>
                    <Grid item sm={true}>
                        <AutocompleteFunctionsThreads
                            id="autocomplete-time-series-experiment-1"
                            data={
                                dataFile['experiments'][experiment1.experiment][
                                    experiment1.run
                                ]['search_function_threads'][event]
                            }
                            onChangeFilter={(filter) =>
                                setFilterFunctionThread1(filter)
                            }
                        />

                        <CpuPlot
                            title="Experiment 1"
                            cpuLabels={dataFile['cpu_labels']}
                            data={
                                dataFile['experiments'][experiment1.experiment][
                                    experiment1.run
                                ]['time_series'][event]
                            }
                            functions={
                                dataFile['experiments'][experiment1.experiment][
                                    experiment1.run
                                ]['functions']['time_series'][event]
                            }
                            threads={
                                dataFile['experiments'][experiment1.experiment][
                                    experiment1.run
                                ]['threads']['time_series'][event]
                            }
                            selectedFunctionsThreads={filterFunctionThread1}
                        />
                    </Grid>
                    <Grid item sm={true}>
                        <AutocompleteFunctionsThreads
                            id="autocomplete-time-series-experiment-2"
                            data={
                                dataFile['experiments'][experiment2.experiment][
                                    experiment2.run
                                ]['search_function_threads'][event]
                            }
                            onChangeFilter={(filter) =>
                                setFilterFunctionThread2(filter)
                            }
                        />

                        <CpuPlot
                            title="Experiment 2"
                            cpuLabels={dataFile['cpu_labels']}
                            data={
                                dataFile['experiments'][experiment2.experiment][
                                    experiment2.run
                                ]['time_series'][event]
                            }
                            functions={
                                dataFile['experiments'][experiment2.experiment][
                                    experiment2.run
                                ]['functions']['time_series'][event]
                            }
                            threads={
                                dataFile['experiments'][experiment2.experiment][
                                    experiment2.run
                                ]['threads']['time_series'][event]
                            }
                            selectedFunctionsThreads={filterFunctionThread2}
                        />
                    </Grid>
                </Grid>
            </ComparisonContainer>
        </Plot>
    );
}

function ThirdSectionPlots({ dataFile, classes }) {
    const [metricComparisonVisualization, setMetricComparisonVisualization] =
        useState('area');

    return (
        <Plot
            title="Comparison between events"
            description="This section generates some metrics based on the comparison between events."
        >
            <ComparisonContainer
                setMetricComparisonVisualization={(e) =>
                    setMetricComparisonVisualization(e)
                }
            >
                <Grid container spacing={8}>
                    <Grid
                        item
                        sm={12}
                        className={classes.containerTitleComparisonEvents}
                    >
                        <h2 className={classes.titleComparisonEvents}>
                            Instructions Per Cycle (IPC)
                        </h2>
                    </Grid>
                    <Grid
                        item
                        sm={6}
                        className={
                            classes.containerTitleComparisonEventExperiment
                        }
                    >
                        <h4 className={classes.titleComparisonEventExperiment}>
                            Experiment 1
                        </h4>
                    </Grid>
                    <Grid
                        item
                        sm={6}
                        className={
                            classes.containerTitleComparisonEventExperiment
                        }
                    >
                        <h4 className={classes.titleComparisonEventExperiment}>
                            Experiment 2
                        </h4>
                    </Grid>
                    <Grid item sm={true}>
                        {loadMetricComparisonPlot(
                            metricComparisonVisualization,
                            dataFile['dataset-1']['ipc-performance'],
                            'Execution time (s)',
                            'IPC',
                        )}
                    </Grid>
                    <Grid item sm={true}>
                        {loadMetricComparisonPlot(
                            metricComparisonVisualization,
                            dataFile['dataset-2']['ipc-performance'],
                            'Execution time (s)',
                            'IPC',
                        )}
                    </Grid>
                </Grid>
                <Grid container spacing={8}>
                    <Grid
                        item
                        sm={12}
                        className={classes.containerTitleComparisonEvents}
                    >
                        <h2 className={classes.titleComparisonEvents}>
                            L1 Cache misses
                        </h2>
                    </Grid>
                    <Grid item sm={true}>
                        {loadMetricComparisonPlot(
                            metricComparisonVisualization,
                            dataFile['dataset-1']['l1-cache-performance'],
                            'Execution time (s)',
                            'L1 misses / Instructions',
                        )}
                    </Grid>
                    <Grid item sm={true}>
                        {loadMetricComparisonPlot(
                            metricComparisonVisualization,
                            dataFile['dataset-2']['l1-cache-performance'],
                            'Execution time (s)',
                            'L1 misses / Instructions',
                        )}
                    </Grid>
                </Grid>
                <Grid container spacing={8}>
                    <Grid
                        item
                        sm={12}
                        className={classes.containerTitleComparisonEvents}
                    >
                        <h2 className={classes.titleComparisonEvents}>
                            LLC Cache misses
                        </h2>
                    </Grid>
                    <Grid item sm={true}>
                        {loadMetricComparisonPlot(
                            metricComparisonVisualization,
                            dataFile['dataset-1']['llc-cache-performance'],
                            'Execution time (s)',
                            'LLC misses / Instructions',
                        )}
                    </Grid>
                    <Grid item sm={true}>
                        {loadMetricComparisonPlot(
                            metricComparisonVisualization,
                            dataFile['dataset-2']['llc-cache-performance'],
                            'Execution time (s)',
                            'LLC misses / Instructions',
                        )}
                    </Grid>
                </Grid>
                <Grid container spacing={8}>
                    <Grid
                        item
                        sm={12}
                        className={classes.containerTitleComparisonEvents}
                    >
                        <h2 className={classes.titleComparisonEvents}>
                            Bus cycles
                        </h2>
                    </Grid>
                    <Grid item sm={true}>
                        {loadMetricComparisonPlot(
                            metricComparisonVisualization,
                            dataFile['dataset-1']['bus-performance'],
                            'Execution time (s)',
                            'Bus cycles rate',
                        )}
                    </Grid>
                    <Grid item sm={true}>
                        {loadMetricComparisonPlot(
                            metricComparisonVisualization,
                            dataFile['dataset-2']['bus-performance'],
                            'Execution time (s)',
                            'Bus cycles rate',
                        )}
                    </Grid>
                </Grid>
            </ComparisonContainer>
        </Plot>
    );
}

export default function Plots({ dataFile }) {
    const classes = useStylesPlots();
    const [experiment1, setExperiment1] = useState(
        dataFile['experiments_to_compare'][0].value,
    );
    const [experiment2, setExperiment2] = useState(
        dataFile['experiments_to_compare'][1].value,
    );

    return (
        <div>
            <Paper
                elevation={4}
                className={classes.selectEventsToCompareContainer}
            >
                <Grid
                    container
                    alignItems="center"
                    justify="center"
                    spacing={3}
                >
                    <Grid item xs={12}>
                        <h3 className={classes.selectEventsToCompare}>
                            Select experiments:
                        </h3>
                    </Grid>
                    <Grid item>
                        <FormControl className={classes.formControl}>
                            <InputLabel id="select-experiment-1">
                                Experiment 1
                            </InputLabel>
                            <Select
                                labelId="select-experiment-1"
                                value={experiment1}
                                onChange={(e) => {
                                    setExperiment1(e.target.value);
                                }}
                            >
                                {dataFile['experiments_to_compare'].map(
                                    (x, i) => (
                                        <MenuItem key={i} value={x.value}>
                                            {x.text}
                                        </MenuItem>
                                    ),
                                )}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item>
                        <FormControl className={classes.formControl}>
                            <InputLabel id="select-experiment-2">
                                Experiment 2
                            </InputLabel>
                            <Select
                                labelId="select-experiment-2"
                                value={experiment2}
                                onChange={(e) => {
                                    setExperiment2(e.target.value);
                                }}
                            >
                                {dataFile['experiments_to_compare'].map(
                                    (x, i) => (
                                        <MenuItem key={i} value={x.value}>
                                            {x.text}
                                        </MenuItem>
                                    ),
                                )}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </Paper>
            <FirstSectionPlots
                dataFile={dataFile}
                classes={classes}
                experiment1={experiment1}
                experiment2={experiment2}
            />
            <SecondSectionPlots
                dataFile={dataFile}
                classes={classes}
                experiment1={experiment1}
                experiment2={experiment2}
            />
        </div>
    );
}

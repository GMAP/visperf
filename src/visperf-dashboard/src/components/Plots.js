import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
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
    autocompleteExperiment: {
        width: 250,
    },
    autocompleteExperimentInput: {
        '& input': {
            fontSize: 13,
        },
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
        marginTop: theme.spacing(2),
        position: 'sticky',
        padding: theme.spacing(2),
        width: 560,
        left: '50%',
        transform: 'translateX(-50%)',
        top: theme.spacing(2),
        backgroundColor: '#FFF',
        zIndex: 1101,
    },
    selectEventsToCompare: {
        textAlign: 'center',
        margin: 'unset',
        padding: 'unset',
        marginBottom: -12,
    },
}));

function loadParallelCoordinatesMetricComparisonPlot(
    dataFile,
    metric,
    experiment1Selected,
    experiment2Selected,
) {
    const experiment1 =
        dataFile['experiments'][experiment1Selected.experiment][
            experiment1Selected.run
        ][metric]['cpu'];
    const experiment2 =
        dataFile['experiments'][experiment2Selected.experiment][
            experiment2Selected.run
        ][metric]['cpu'];

    const comparison = createComparison(experiment1, experiment2);
    const intersection = flatten2dArray(comparison['mean_reverse']);

    return (
        <ParallelCoordinatePlot
            numberCpus={dataFile['cpus']}
            margin={{ top: 40, left: 50, bottom: 10, right: 50 }}
            width={700}
            height={50 * dataFile['cpu_labels'].length}
            dimensions={[
                {
                    name: 'CPU',
                    labels: flatten2dArray(dataFile['cpu_labels']),
                    reverseScale: true,
                    ticks: dataFile['cpus'] / 2,
                },
                {
                    name: 'Experiment 1',
                    hideLabels: false,
                },
                { name: 'Experiment 2', hideLabels: false },
                { name: 'Difference', hideLabels: false },
            ]}
            timeSeries={false}
            data={transposeArrays([
                flatten2dArray(dataFile['cpu_labels']).map((_, i) => i),
                flatten2dArray(experiment1),
                flatten2dArray(experiment2),
                intersection,
            ])}
        />
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
    const intersection = flatten2dArray(comparison['mean_relative_reverse']);

    return (
        <ParallelCoordinatePlot
            numberCpus={dataFile['cpus']}
            margin={{ top: 40, left: 50, bottom: 10, right: 50 }}
            width={700}
            height={50 * dataFile['cpu_labels'].length}
            dimensions={[
                {
                    name: 'CPU',
                    labels: flatten2dArray(dataFile['cpu_labels']),
                    reverseScale: true,
                    ticks: dataFile['cpus'] / 2,
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

function loadMetricComparisonPlot(
    metricVisualization,
    data,
    xLabel,
    yLabel,
    cpus,
    cpuIDs,
    cpuLabels,
) {
    if (metricVisualization === 'area') {
        return (
            <AreaPlot
                xLabel={xLabel}
                yLabel={yLabel}
                data={data['time_series']}
                margin={{
                    top: 5,
                    left: 80,
                    rigth: 15,
                    bottom: 60,
                }}
            />
        );
    } else if (metricVisualization === 'cpus') {
        return (
            <CpuPlot
                legendLabels={['max', 'min']}
                margin={5}
                squareSize={70}
                fontSize=".9em"
                timeSeries={false}
                cpuIDs={cpuIDs}
                showValues={true}
                cpuLabels={cpuLabels}
                numberCpus={cpus}
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
            title="Comparing experiments"
            description="This section allows you to compare events captured in experiments selected."
        >
            <ComparisonContainer
                events={dataFile['events_captured']}
                setComparisonEvent={(e) => setEvent(e)}
                setComparisonVisualization={(e) => setVisualization(e)}
            >
                {visualization === 'cpus' ? (
                    <Grid container spacing={4}>
                        <Grid item xs={6}>
                            <CpuPlot
                                margin={5}
                                squareSize={55}
                                fontSize=".9em"
                                timeSeries={false}
                                title="Experiment 1"
                                additionalLegendLabels={['%', '']}
                                cpuLabels={dataFile['cpu_labels']}
                                showValues={true}
                                valuesAdditionalText="%"
                                fontSizeAdditionalValues=".9em"
                                numberCpus={dataFile['cpus']}
                                cpuIDs={dataFile['cpu_labels'].map((x) =>
                                    x.map((y) => +y.replace('CPU', '')),
                                )}
                                data={
                                    dataFile['experiments'][
                                        experiment1.experiment
                                    ][experiment1.run]['cpu'][event][
                                        'mean_relative'
                                    ]
                                }
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <CpuPlot
                                margin={5}
                                squareSize={55}
                                timeSeries={false}
                                fontSize=".9em"
                                title="Experiment 2"
                                additionalLegendLabels={['%', '']}
                                cpuLabels={dataFile['cpu_labels']}
                                showValues={true}
                                valuesAdditionalText="%"
                                fontSizeAdditionalValues=".9em"
                                cpuIDs={dataFile['cpu_labels'].map((x) =>
                                    x.map((y) => +y.replace('CPU', '')),
                                )}
                                numberCpus={dataFile['cpus']}
                                data={
                                    dataFile['experiments'][
                                        experiment2.experiment
                                    ][experiment2.run]['cpu'][event][
                                        'mean_relative'
                                    ]
                                }
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
                            Indication of how the event counter changed between
                            experiments.
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
            title="Comparing experiments over execution time"
            description="This section allows you to compare the events captured over the period the experiments were run. Also, you can select regions of interest; you can search for specific functions or thread ids."
        >
            <ComparisonContainer
                events={dataFile['events_captured']}
                setComparisonEvent={(e) => setEvent(e)}
            >
                <Grid container spacing={8}>
                    <Grid item xs={6}>
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
                            cpuIDs={dataFile['cpu_labels'].map((x) =>
                                x.map((y) => +y.replace('CPU', '')),
                            )}
                            squareSize={60}
                            title="Experiment 1"
                            cpuLabels={dataFile['cpu_labels']}
                            numberCpus={dataFile['cpus']}
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
                    <Grid item xs={6}>
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
                            squareSize={60}
                            title="Experiment 2"
                            cpuLabels={dataFile['cpu_labels']}
                            numberCpus={dataFile['cpus']}
                            cpuIDs={dataFile['cpu_labels'].map((x) =>
                                x.map((y) => +y.replace('CPU', '')),
                            )}
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

function ThirdSectionPlots({ dataFile, classes, experiment1, experiment2 }) {
    const [metricVisualization, setMetricVisualization] = useState('area');

    return (
        <Plot
            title="Performance evaluation metrics"
            description="This section shows some metrics that will help you to compare how the experiments performed."
        >
            <ComparisonContainer
                setComparisonMetricVisualization={(e) =>
                    setMetricVisualization(e)
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
                    {metricVisualization !== 'parallel-coordinates' && [
                        <Grid
                            key={0}
                            item
                            sm={6}
                            className={
                                classes.containerTitleComparisonEventExperiment
                            }
                        >
                            <h4
                                className={
                                    classes.titleComparisonEventExperiment
                                }
                            >
                                Experiment 1
                            </h4>
                        </Grid>,
                        <Grid
                            key={1}
                            item
                            sm={6}
                            className={
                                classes.containerTitleComparisonEventExperiment
                            }
                        >
                            <h4
                                className={
                                    classes.titleComparisonEventExperiment
                                }
                            >
                                Experiment 2
                            </h4>
                        </Grid>,
                    ]}
                    {metricVisualization === 'parallel-coordinates' ? (
                        <Grid item sm={true}>
                            {loadParallelCoordinatesMetricComparisonPlot(
                                dataFile,
                                'ipc_performance',
                                experiment1,
                                experiment2,
                            )}
                        </Grid>
                    ) : (
                        [
                            <Grid key={0} item sm={true}>
                                {loadMetricComparisonPlot(
                                    metricVisualization,
                                    dataFile['experiments'][
                                        experiment1.experiment
                                    ][experiment1.run]['ipc_performance'],
                                    'Execution time (s)',
                                    'IPC',
                                    dataFile['cpus'],
                                    dataFile['cpu_labels'].map((x) =>
                                        x.map((y) => +y.replace('CPU', '')),
                                    ),
                                    dataFile['cpu_labels'],
                                )}
                            </Grid>,
                            <Grid key={1} item sm={true}>
                                {loadMetricComparisonPlot(
                                    metricVisualization,
                                    dataFile['experiments'][
                                        experiment2.experiment
                                    ][experiment2.run]['ipc_performance'],
                                    'Execution time (s)',
                                    'IPC',
                                    dataFile['cpus'],
                                    dataFile['cpu_labels'].map((x) =>
                                        x.map((y) => +y.replace('CPU', '')),
                                    ),
                                    dataFile['cpu_labels'],
                                )}
                            </Grid>,
                        ]
                    )}
                </Grid>
            </ComparisonContainer>
        </Plot>
    );
}

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

export default function Plots({ dataFile }) {
    const classes = useStylesPlots();
    const [experiment1, setExperiment1] = useState(
        dataFile['experiments_to_compare'][0],
    );
    const [experiment2, setExperiment2] = useState(
        dataFile['experiments_to_compare'][1],
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
                    justifyContent="center"
                    spacing={3}
                >
                    <Grid item xs={12} style={{ paddingBottom: 0 }}>
                        <h3 className={classes.selectEventsToCompare}>
                            Select experiments:
                        </h3>
                    </Grid>
                    <Grid item>
                        <Autocomplete
                            className={classes.autocompleteExperiment}
                            options={dataFile['experiments_to_compare']}
                            disableClearable
                            getOptionLabel={(option) => option.text}
                            id="autocomplete-experiment-1"
                            value={experiment1}
                            onChange={(_, newValue) => {
                                setExperiment1(newValue);
                            }}
                            renderOption={(option, { selected }) => {
                                return (
                                    <p
                                        style={{
                                            fontSize: 12,
                                            marginTop: 0,
                                            marginBottom: 0,
                                        }}
                                        key={option.value}
                                    >
                                        {option.text}
                                    </p>
                                );
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    className={
                                        classes.autocompleteExperimentInput
                                    }
                                    label="Experiment 1"
                                    margin="normal"
                                />
                            )}
                        />
                    </Grid>
                    <Grid item>
                        <Autocomplete
                            className={classes.autocompleteExperiment}
                            options={dataFile['experiments_to_compare']}
                            getOptionLabel={(option) => option.text}
                            id="autocomplete-experiment-2"
                            value={experiment2}
                            disableClearable
                            onChange={(_, newValue) => {
                                setExperiment2(newValue);
                            }}
                            renderOption={(option, { selected }) => {
                                return (
                                    <p
                                        style={{
                                            fontSize: 12,
                                            marginTop: 0,
                                            marginBottom: 0,
                                        }}
                                        key={option.value}
                                    >
                                        {option.text}
                                    </p>
                                );
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    className={
                                        classes.autocompleteExperimentInput
                                    }
                                    label="Experiment 2"
                                    margin="normal"
                                />
                            )}
                        />
                    </Grid>
                </Grid>
            </Paper>
            <FirstSectionPlots
                dataFile={dataFile}
                classes={classes}
                experiment1={experiment1.value}
                experiment2={experiment2.value}
            />
            <SecondSectionPlots
                dataFile={dataFile}
                classes={classes}
                experiment1={experiment1.value}
                experiment2={experiment2.value}
            />
            <ThirdSectionPlots
                dataFile={dataFile}
                classes={classes}
                experiment1={experiment1.value}
                experiment2={experiment2.value}
            />
        </div>
    );
}

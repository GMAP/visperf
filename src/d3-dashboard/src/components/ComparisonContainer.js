import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles((theme) => ({
    container: {
        marginBottom: theme.spacing(4),
    },
    formControl: {
        minWidth: 150,
    },
}));

export default function ComparisonContainer({
    children,
    events,
    setComparisonEvent,
    setComparisonVisualization,
    setComparisonBaseExperiment,
    setMetricComparisonVisualization,
}) {
    const classes = useStyles();
    const [event, setEvent] = useState(setComparisonEvent ? events[0] : null);
    const [baseExperiment, setBaseExperiment] = useState('comparison-1-2');
    const [visualization, setVisualization] = useState('parallel-coordinates');
    const [metricVisualization, setMetricVisualization] = useState('area');

    return (
        <div>
            <div className={classes.container}>
                <Grid
                    container
                    spacing={6}
                    alignItems="center"
                    justify="center"
                >
                    {setComparisonEvent && (
                        <Grid item>
                            <FormControl className={classes.formControl}>
                                <InputLabel id="select-event">Event</InputLabel>
                                <Select
                                    labelId="select-event"
                                    value={event}
                                    onChange={(e) => {
                                        setEvent(e.target.value);
                                        setComparisonEvent(e.target.value);
                                    }}
                                >
                                    {events.map((x, i) => (
                                        <MenuItem key={i} value={x}>
                                            {x}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    )}
                    {setMetricComparisonVisualization && (
                        <Grid item>
                            <FormControl className={classes.formControl}>
                                <InputLabel id="select-metric-visualization">
                                    Visualization
                                </InputLabel>
                                <Select
                                    labelId="select-metric-visualization"
                                    value={metricVisualization}
                                    onChange={(e) => {
                                        setMetricVisualization(e.target.value);
                                        setMetricComparisonVisualization(
                                            e.target.value,
                                        );
                                    }}
                                >
                                    <MenuItem value="area">Time chart</MenuItem>
                                    <MenuItem value="cpus">CPUs</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    )}
                    {setComparisonVisualization && (
                        <Grid item>
                            <FormControl className={classes.formControl}>
                                <InputLabel id="select-visualization">
                                    Comparison Plot
                                </InputLabel>
                                <Select
                                    labelId="select-visualization"
                                    value={visualization}
                                    onChange={(e) => {
                                        setVisualization(e.target.value);
                                        setComparisonVisualization(
                                            e.target.value,
                                        );
                                    }}
                                >
                                    <MenuItem value="parallel-coordinates">
                                        Parallel Coordinates
                                    </MenuItem>
                                    <MenuItem value="cpus">CPUs</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    )}
                    {setComparisonBaseExperiment && (
                        <Grid item>
                            <FormControl className={classes.formControl}>
                                <InputLabel id="select-base-experiment">
                                    Base experiment
                                </InputLabel>
                                <Select
                                    labelId="select-base-experiment"
                                    value={baseExperiment}
                                    onChange={(e) => {
                                        setBaseExperiment(e.target.value);
                                        setComparisonBaseExperiment(
                                            e.target.value,
                                        );
                                    }}
                                >
                                    <MenuItem value="comparison-1-2">
                                        Experiment 1
                                    </MenuItem>
                                    <MenuItem value="comparison-2-1">
                                        Experiment 2
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    )}
                </Grid>
            </div>
            {children}
        </div>
    );
}

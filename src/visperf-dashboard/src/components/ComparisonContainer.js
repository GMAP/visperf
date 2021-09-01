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
    setComparisonMetricVisualization,
}) {
    const classes = useStyles();
    const [event, setEvent] = useState(setComparisonEvent ? events[0] : null);
    const [visualization, setVisualization] = useState('parallel-coordinates');
    const [metricVisualization, setMetricVisualization] = useState('area');

    return (
        <div>
            <div className={classes.container}>
                <Grid
                    container
                    spacing={6}
                    alignItems="center"
                    justifyContent="center"
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
                    {setComparisonMetricVisualization && (
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
                                        setComparisonMetricVisualization(
                                            e.target.value,
                                        );
                                    }}
                                >
                                    <MenuItem value="area">Time Chart</MenuItem>
                                    <MenuItem value="parallel-coordinates">
                                        Parallel Coordinates
                                    </MenuItem>
                                    <MenuItem value="cpus">CPUs</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    )}
                    {setComparisonVisualization && (
                        <Grid item>
                            <FormControl className={classes.formControl}>
                                <InputLabel id="select-visualization">
                                    Plot
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
                </Grid>
            </div>
            {children}
        </div>
    );
}

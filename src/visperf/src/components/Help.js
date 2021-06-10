import React from 'react';
import Paper from '@material-ui/core/Paper';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        position: 'fixed',
        top: 80,
        bottom: theme.spacing(4),
        right: theme.spacing(4),
        width: 400,
        overflowY: 'scroll',
    },
    toolbar: {
        margin: 'auto',
    },
}));

export default function Help() {
    const classes = useStyles();

    return (
        <Paper elevation={10} className={classes.root}>
            <AppBar position="static">
                <Toolbar className={classes.toolbar}>
                    <Typography variant="h6">Help</Typography>
                </Toolbar>
            </AppBar>
            <Container>
                <Box my={1}>
                    <p>
                        <b>cpu-cycles</b>: number of fetch-decode-execute cycles
                        the CPU executed;
                    </p>
                    <p>
                        <b>instructions</b>: number of instructions the CPU
                        executed;
                    </p>
                    <p>
                        <b>cache-misses</b>: number of cache-misses;
                    </p>
                    <p>
                        <b>cache-references</b>: number of references found in
                        cache;
                    </p>
                    <p>
                        <b>L1-dcache-load-misses</b>: number of misses when
                        loading data from L1 cache;
                    </p>
                    <p>
                        <b>L1-dcache-loads</b>: number of data loads from L1
                        cache;
                    </p>
                    <p>
                        <b>L1-dcache-stores</b>: number of data stores made in
                        L1 cache;
                    </p>
                    <p>
                        <b>L1-icache-load-misses</b>: number of misses when
                        loading instructions from L1 cache;
                    </p>
                    <p>
                        <b>L1-icache-loads</b>: number of instructions load from
                        L1 cache;
                    </p>
                    <p>
                        <b>L1-icache-stores</b>: number of instructions store
                        made in L1 cache;
                    </p>
                    <p>
                        <b>LLC-loads</b>: number of references loaded from LLC
                        (Last Level Cache, usually L3);
                    </p>
                    <p>
                        <b>LLC-load-misses</b>: number of references missed when
                        loading from LLC;
                    </p>
                    <p>
                        <b>LLC-stores</b>: number of references store made
                        loading in LLC;
                    </p>
                    <p>
                        <b>mem-stores</b>: number of stores made in the main
                        memory;
                    </p>
                    <p>
                        <b>mem-loads</b>: number of loads made from the main
                        memory;
                    </p>
                </Box>
            </Container>
        </Paper>
    );
}

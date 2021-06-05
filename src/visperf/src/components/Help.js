import React from 'react';
import Paper from '@material-ui/core/Paper';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        position: 'fixed',
        top: 80,
        bottom: theme.spacing(4),
        right: theme.spacing(4),
        width: 400,
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
                <p>Someday help will exist.</p>
            </Container>
        </Paper>
    );
}

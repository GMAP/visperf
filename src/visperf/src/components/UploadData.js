import React from 'react';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    container: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        paddingTop: theme.spacing(0.5),
        paddingBottom: theme.spacing(2),
    },
    uploadInput: {
        display: 'none',
    },
    spanInfo: {
        paddingLeft: theme.spacing(1),
    },
}));

export default function UploadData(props) {
    const classes = useStyles();
    const { dataFile } = props;

    return (
        <Paper elevation={1} className={classes.container}>
            <h2>Upload the file with parsed experiments:</h2>
            <input
                accept=".json,application/json"
                className={classes.uploadInput}
                id="contained-button-file"
                onChange={(e) => props.setDataFile(e.target.files[0])}
                type="file"
            />
            <label htmlFor="contained-button-file">
                <Button variant="contained" color="primary" component="span">
                    Upload file
                </Button>
            </label>
            {dataFile && (
                <span className={classes.spanInfo}>
                    File {dataFile.name} uploaded.
                </span>
            )}
        </Paper>
    );
}

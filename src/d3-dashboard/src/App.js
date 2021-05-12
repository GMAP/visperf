import React, { useState } from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import { UploadData, Plots } from './components';
import { readJsonFile } from './utils';

function ElevationScroll(props) {
    const { children, window } = props;
    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 0,
        target: window ? window() : undefined,
    });

    return React.cloneElement(children, {
        elevation: trigger ? 4 : 0,
    });
}

ElevationScroll.propTypes = {
    children: PropTypes.element.isRequired,
    window: PropTypes.func,
};

const useStyles = makeStyles((theme) => ({
    container: {
        marginTop: theme.spacing(2),
    },
    readingFile: {
        textAlign: 'center',
        marginTop: theme.spacing(2),
    },
}));

export default function App(props) {
    const classes = useStyles();
    const [dataFile, setDataFile] = useState(undefined);
    const [readingFile, setReadingFile] = useState(false);
    const [jsonDataFile, setJsonDataFile] = useState(undefined);

    async function readFile(file) {
        setDataFile(file);
        setReadingFile(true);

        const fileContent = await readJsonFile(file);
        setJsonDataFile(fileContent);

        setReadingFile(false);
    }

    return (
        <React.Fragment>
            <CssBaseline />
            <ElevationScroll {...props}>
                <AppBar>
                    <Toolbar>
                        <Typography variant="h6">VisCPU</Typography>
                    </Toolbar>
                </AppBar>
            </ElevationScroll>
            <Toolbar />
            <Container maxWidth="lg" className={classes.container}>
                <Box>
                    <UploadData
                        dataFile={dataFile}
                        setDataFile={(file) => readFile(file)}
                    />
                    {/* {dataFile && readingFile && ( */}
                    {/*     <div className={classes.readingFile}> */}
                    {/*         <p>Loading plots...</p> */}
                    {/*         <LinearProgress /> */}
                    {/*     </div> */}
                    {/* )} */}
                    {/* {dataFile && ( */}
                    <div>
                        <Plots dataFile={jsonDataFile} />
                    </div>
                    {/* )} */}
                </Box>
            </Container>
        </React.Fragment>
    );
}

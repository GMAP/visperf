import React, { useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import orange from '@material-ui/core/colors/orange';
import deepOrange from '@material-ui/core/colors/deepOrange';
import HelpIcon from '@material-ui/icons/Help';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import { UploadData, Plots, Help } from './components';
import { readJsonFile } from './utils';
import logo from './icon-white.png';

const theme = createTheme({
    palette: {
        primary: {
            main: orange[900],
        },
        secondary: {
            main: deepOrange[900],
        },
    },
});

const useStyles = makeStyles((theme) => ({
    container: {
        marginTop: theme.spacing(2),
    },
    readingFile: {
        textAlign: 'center',
        marginTop: theme.spacing(2),
    },
    toolbarTitle: {
        flexGrow: 1,
    },
    logo: {
        maxWidth: 42,
        marginRight: theme.spacing(2),
    },
    footerContainer: {
        textAlign: 'center',
    },
}));

async function loadDemoData() {
    const request = await fetch('/visperf/demo.json');
    return request.json();
}

export default function App() {
    const classes = useStyles();
    const [showHelp, setShowHelp] = useState(false);
    const [dataFile, setDataFile] = useState(null);
    const [readingFile, setReadingFile] = useState(false);
    const [jsonDataFile, setJsonDataFile] = useState(null);

    async function readFile(file) {
        setDataFile(file);
        setReadingFile(true);

        const fileContent = await readJsonFile(file);
        setJsonDataFile(fileContent);

        setReadingFile(false);
    }

    async function loadDemo() {
        setDataFile('demo');
        setReadingFile(true);
        const jsonData = await loadDemoData();
        setJsonDataFile(jsonData);
        setReadingFile(false);
    }

    return (
        <React.Fragment>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <AppBar elevation={4}>
                    <Toolbar>
                        <img className={classes.logo} alt="" src={logo} />
                        <Typography
                            className={classes.toolbarTitle}
                            variant="h4"
                        >
                            VisPerf
                        </Typography>
                        <div>
                            {showHelp ? (
                                <Tooltip title="Close help">
                                    <IconButton
                                        color="inherit"
                                        onClick={() => setShowHelp(false)}
                                    >
                                        <CloseIcon />
                                    </IconButton>
                                </Tooltip>
                            ) : (
                                <Tooltip title="Show help">
                                    <IconButton
                                        color="inherit"
                                        onClick={() => setShowHelp(true)}
                                    >
                                        <HelpIcon />
                                    </IconButton>
                                </Tooltip>
                            )}
                        </div>
                    </Toolbar>
                </AppBar>
                <Toolbar />
                <Container maxWidth="lg" className={classes.container}>
                    <Box>
                        <UploadData
                            dataFile={dataFile}
                            setDataFile={(file) => readFile(file)}
                            onLoadDemo={() => loadDemo()}
                        />
                        {dataFile && readingFile && (
                            <div className={classes.readingFile}>
                                <p>Loading experiments...</p>
                                <LinearProgress />
                            </div>
                        )}
                        {dataFile && !readingFile && (
                            <div>
                                <Plots dataFile={jsonDataFile} />
                            </div>
                        )}
                        <div className={classes.footerContainer}>
                            <h5>
                                Developed by{' '}
                                <a
                                    href="https://claudioscheer.github.io"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    Claudio Scheer
                                </a>
                                , in 2021. You can find the source code{' '}
                                <a
                                    href="https://github.com/GMAP/visperf"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    here
                                </a>
                                .
                            </h5>
                            <h5>
                                This work was advised by professor{' '}
                                <a
                                    href="https://www.dalvangriebler.com"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    Dalvan Griebler
                                </a>
                                .
                            </h5>
                        </div>
                    </Box>
                </Container>
                {showHelp && <Help />}
            </ThemeProvider>
        </React.Fragment>
    );
}

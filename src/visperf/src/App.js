import React, { useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import orange from '@material-ui/core/colors/orange';
import deepOrange from '@material-ui/core/colors/deepOrange';
import { UploadData, Plots } from './components';
import { readJsonFile } from './utils';
import logo from './icon-white.png';

const theme = createMuiTheme({
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
    toolbar: {
        margin: 'auto',
    },
    logo: {
        maxWidth: 42,
        marginRight: theme.spacing(2),
    },
    footerContainer: {
        textAlign: 'center',
    },
}));

export default function App() {
    const classes = useStyles();
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

    return (
        <React.Fragment>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <AppBar elevation={4}>
                    <Toolbar className={classes.toolbar}>
                        <img className={classes.logo} alt="" src={logo} />
                        <Typography variant="h4">VisPerf</Typography>
                    </Toolbar>
                </AppBar>
                <Toolbar />
                <Container maxWidth="lg" className={classes.container}>
                    <Box>
                        <UploadData
                            dataFile={dataFile}
                            setDataFile={(file) => readFile(file)}
                        />
                        {dataFile && readingFile && (
                            <div className={classes.readingFile}>
                                <p>Loading plots...</p>
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
                                    href="https://github.com/claudioscheer/visperf"
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
            </ThemeProvider>
        </React.Fragment>
    );
}

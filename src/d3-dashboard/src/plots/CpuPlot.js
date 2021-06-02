import React, { useState, useRef, useEffect } from 'react';
import Slider from '@material-ui/core/Slider';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import * as d3 from 'd3';
import { LegendColorScale } from './';

const useStyles = makeStyles((theme) => ({
    title: {
        textAlign: 'center',
    },
    plotContainer: {
        textAlign: 'center',
        marginBottom: theme.spacing(1),
    },
    sliderLabel: {
        marginTop: 0,
        textAlign: 'center',
    },
}));

function filterFunctionThread(
    functions,
    threads,
    selectedFunctionsThreads,
    dataPlot,
    cpuLabels,
) {
    const dataPlotClone = JSON.parse(JSON.stringify(dataPlot));
    for (let row = 0; row < dataPlotClone.length; row++) {
        for (let col = 0; col < dataPlotClone[0].length; col++) {
            dataPlotClone[row][col] = 0;
        }
    }

    for (let row = 0; row < dataPlotClone.length; row++) {
        for (let col = 0; col < dataPlotClone[0].length; col++) {
            const cpuNumber = cpuLabels[row][col];
            for (const i in selectedFunctionsThreads) {
                const filter = selectedFunctionsThreads[i];
                if (filter.type === 'function') {
                    if (
                        cpuNumber in functions &&
                        filter.value in functions[cpuNumber]
                    ) {
                        dataPlotClone[row][col] +=
                            functions[cpuNumber][filter.value];
                    }
                } else if (filter.type === 'thread') {
                    if (
                        cpuNumber in threads &&
                        filter.value in threads[cpuNumber]
                    ) {
                        dataPlotClone[row][col] +=
                            threads[cpuNumber][filter.value];
                    }
                }
            }
        }
    }
    return dataPlotClone;
}

export default function CpuPlot({
    data,
    cpuLabels,
    title,
    functions = null,
    threads = null,
    selectedFunctionsThreads = null,
    fontSize = '1em',
    margin = 10,
    d3ColorScale = 'interpolateYlOrRd',
    timeSeries = true,
    squareSize = 80,
    legendPoints = [0, 100],
    legendPositions = [0.02, 0.98],
    legendLabels = ['∞', '0'],
    legendInvert = true,
}) {
    const classes = useStyles();
    const plotRef = useRef();
    let svg = useRef(null);

    let captures = null;
    let times = null;
    let sliderConfig = { min: 0 };
    if (timeSeries) {
        captures = data['captures'];
        times = Object.keys(captures).map((x) => parseFloat(x));
        sliderConfig = {
            min: Math.min(...times),
            max: Math.max(...times),
            marks: times.map((x) => ({ value: x })),
        };
    }

    const [sliderValue, setSliderValue] = useState(sliderConfig.min);

    let dataPlot = null;
    if (timeSeries) {
        if (sliderValue > sliderConfig.max) {
            setSliderValue(sliderConfig.max);
            dataPlot = captures[sliderConfig.max];
        } else {
            dataPlot = captures[sliderValue];
        }
        if (selectedFunctionsThreads.length > 0) {
            dataPlot = filterFunctionThread(
                functions[sliderValue],
                threads[sliderValue],
                selectedFunctionsThreads,
                dataPlot,
                cpuLabels,
            );
        }
    } else {
        dataPlot = data;
    }
    const width = squareSize * dataPlot[0].length;
    const height = squareSize * dataPlot.length;
    const minValue = Math.min(...[].concat(...dataPlot));
    const maxValue = Math.max(...[].concat(...dataPlot));

    useEffect(() => {
        const colorScale = d3
            .scaleSequential(d3[d3ColorScale])
            .domain([minValue, maxValue]);
        const x = d3
            .scaleLinear()
            .range([0, width])
            .domain([0, dataPlot[0].length]);
        const y = d3
            .scaleLinear()
            .range([0, height])
            .domain([0, dataPlot.length]);

        if (svg.current) {
            const row = svg.current.selectAll('.row').data(dataPlot);
            row.selectAll('.cell')
                .data((d, i) =>
                    d.map((a) => ({
                        value: a,
                        row: i,
                    })),
                )
                .transition()
                .duration(300)
                .attr('x', (_, i) => x(i))
                .attr('y', (d, _) => y(d.row))
                .style('fill', (d) => {
                    if (d.value === 0) {
                        return '#eee';
                    }
                    return colorScale(d.value);
                });
        } else {
            svg.current = d3
                .select(plotRef.current)
                .append('svg')
                .attr('width', width + margin * 2)
                .attr('height', height + margin * 2)
                .append('g')
                .attr('transform', 'translate(' + margin + ',' + margin + ')');
            const row = svg.current
                .selectAll('.row')
                .data(dataPlot)
                .enter()
                .append('g')
                .attr('class', 'row');
            row.selectAll('.cell')
                .data((d, i) =>
                    d.map((a) => ({
                        value: a,
                        row: i,
                    })),
                )
                .enter()
                .append('rect')
                .attr('class', 'cell')
                .attr('x', (_, i) => x(i))
                .attr('y', (d, _) => y(d.row))
                .attr('width', squareSize * 0.98)
                .attr('height', squareSize * 0.98)
                .attr('rx', 3)
                .style('stroke', 'black')
                .style('stroke-width', 2)
                .style('fill', (d) => {
                    if (d.value === 0) {
                        return '#eee';
                    }
                    return colorScale(d.value);
                });

            row.selectAll('.label')
                .data((d, i) =>
                    d.map((a) => ({
                        value: a,
                        row: i,
                    })),
                )
                .enter()
                .append('text')
                .attr('class', 'label')
                .style('text-anchor', 'middle')
                .attr('font-weight', 400)
                .attr('font-size', fontSize)
                .attr('x', (_, i) => x(i) + squareSize / 2)
                .attr('y', (d) => y(d.row) + squareSize / 2)
                .text((d, i) => cpuLabels[d.row][i]);
        }
    }, [sliderValue, dataPlot]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div>
            {title && <h3 className={classes.title}>{title}</h3>}
            <Grid container justify="center">
                <Grid item>
                    <div className={classes.plotContainer} ref={plotRef}></div>
                </Grid>
                <Grid item>
                    <LegendColorScale
                        legendPoints={legendPoints}
                        legendPositions={legendPositions}
                        legendLabels={legendLabels}
                        invert={legendInvert}
                        margin={{
                            top: margin,
                            left: 5,
                            bottom: margin,
                            right: 22,
                        }}
                        d3ColorScale={d3ColorScale}
                        width={20}
                        height={height}
                    />
                </Grid>
            </Grid>
            {timeSeries && (
                <div>
                    <Slider
                        track={false}
                        min={sliderConfig.min}
                        step={null}
                        marks={sliderConfig.marks}
                        max={sliderConfig.max}
                        value={sliderValue}
                        onChange={(_, value) => setSliderValue(value)}
                    />
                    <p className={classes.sliderLabel}>
                        Application execution at <b>{sliderValue} sec.</b>
                    </p>
                </div>
            )}
        </div>
    );
}

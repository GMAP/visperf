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

export default function CpuPlot({
    data,
    cpuLabels,
    title,
    fontSize = '1em',
    margin = 10,
    d3ColorScale = 'interpolateYlOrRd',
    timeSeries = true,
    squareSize = 80,
    legendPoints = [0, 100],
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
        dataPlot = captures[sliderValue];
    } else {
        dataPlot = data;
    }
    const width = squareSize * dataPlot[0].length;
    const height = squareSize * dataPlot.length;

    useEffect(() => {
        const colorScale = d3
            .scaleSequential(d3[d3ColorScale])
            .domain([
                Math.min(...[].concat(...dataPlot)),
                Math.max(...[].concat(...dataPlot)),
            ]);
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
                .style('fill', (d) => colorScale(d.value));
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
                .style('fill', (d) => colorScale(d.value));

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
                        margin={margin}
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

import React, { useState, useRef, useEffect } from 'react';
import Slider from '@material-ui/core/Slider';
import { makeStyles } from '@material-ui/core/styles';
import * as d3 from 'd3';

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
    d3ColorScale = 'interpolateYlOrRd',
    timeSeries = true,
    squareSize = 80,
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

    useEffect(() => {
        let dataPlot = null;
        if (timeSeries) {
            dataPlot = captures[sliderValue];
        } else {
            dataPlot = data;
        }
        const width = squareSize * dataPlot[0].length;
        const height = squareSize * dataPlot.length;

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
                .attr('width', width)
                .attr('height', height)
                .append('g');
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
                .attr('rx', 7)
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
                .attr('x', (_, i) => x(i) + squareSize / 2)
                .attr('y', (d) => y(d.row) + squareSize / 2)
                .text((d, i) => cpuLabels[d.row][i]);
        }
    }, [sliderValue, data]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div>
            {title && <h4 className={classes.title}>{title}</h4>}
            <div className={classes.plotContainer} ref={plotRef}></div>
            {timeSeries && (
                <div>
                    <Slider
                        track="inverted"
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

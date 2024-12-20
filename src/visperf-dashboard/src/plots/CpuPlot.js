import React, { useState, useRef, useEffect } from 'react';
import Slider from '@material-ui/core/Slider';
import { makeStyles } from '@material-ui/core/styles';
import * as d3 from 'd3';
import _uniqueId from 'lodash/uniqueId';
import millify from 'millify';
import { DownloadSvg } from '../components';

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
    numberCpus,
    cpuLabels,
    cpuIDs,
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
    legendPositions = [
        { p: 0, anchor: 'start' },
        { p: 1, anchor: 'end' },
    ],
    legendLabels = ['max', 'min'],
    additionalLegendLabels = ['', ''],
    legendInvert = true,
    showValues = false,
    valuesAdditionalText = '',
    fontSizeAdditionalValues = '.9em',
}) {
    const [gradientId] = useState(_uniqueId('gradient-legend'));
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
        if (!(sliderValue in captures)) {
            setSliderValue(sliderConfig.min);
            dataPlot = captures[sliderConfig.min];
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
    const legendWidth = 20;
    const lengendMargin = { left: 5, right: 20 };
    const legendColorScale = d3
        .scaleSequential(d3[d3ColorScale])
        .domain(
            legendInvert
                ? [legendPoints[legendPoints.length - 1], legendPoints[0]]
                : [legendPoints[0], legendPoints[legendPoints.length - 1]],
        );

    const hideItem = (x, y, display = false) => {
        const cpuNumber = cpuIDs[x][y];
        if (display) {
            return cpuNumber >= numberCpus ? 'none' : 'block';
        }
        return cpuNumber >= numberCpus ? 'hidden' : 'visible';
    };

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
            svg.current.selectAll('.label-legend').remove();
            svg.current.selectAll('.label').remove();

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
                .style('visibility', (d, i) => hideItem(d.row, i))
                .style('display', (d, i) => hideItem(d.row, i, true))
                .style('fill', (d) => {
                    if (d.value === 0) {
                        return '#eee';
                    }
                    return colorScale(d.value);
                });

            const items = row
                .selectAll('.label')
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
                .style('visibility', (d, i) => hideItem(d.row, i))
                .style('display', (d, i) => hideItem(d.row, i, true))
                .attr('font-weight', 400)
                .attr('font-size', fontSize)
                .attr('x', (_, i) => x(i) + squareSize / 2)
                .attr('y', (d) => y(d.row) + squareSize / 2);

            items
                .append('svg:tspan')
                .attr('x', (_, i) => x(i) + squareSize / 2)
                .attr('y', (d) => y(d.row) + squareSize / 2)
                .text((d, i) => {
                    return cpuLabels[d.row][i];
                });

            if (showValues) {
                items
                    .append('svg:tspan')
                    .attr('x', (_, i) => x(i) + squareSize / 2)
                    .attr(
                        'y',
                        (d) => y(d.row) + squareSize / 2 + squareSize / 3,
                    )
                    .attr('font-size', fontSizeAdditionalValues)
                    .text((d, i) => {
                        return (
                            millify(dataPlot[d.row][i], { precision: 2 }) +
                            valuesAdditionalText
                        );
                    });
            }
        } else {
            svg.current = d3
                .select(plotRef.current)
                .append('svg')
                .attr(
                    'width',
                    width +
                        margin * 2 +
                        (legendWidth +
                            lengendMargin.left +
                            lengendMargin.right),
                )
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
                .style('visibility', (d, i) => hideItem(d.row, i))
                .style('display', (d, i) => hideItem(d.row, i, true))
                .style('fill', (d) => {
                    if (d.value === 0) {
                        return '#eee';
                    }
                    return colorScale(d.value);
                });

            const items = row
                .selectAll('.label')
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
                .style('visibility', (d, i) => hideItem(d.row, i))
                .style('display', (d, i) => hideItem(d.row, i, true))
                .attr('font-weight', 400)
                .attr('font-size', fontSize)
                .attr('x', (_, i) => x(i) + squareSize / 2)
                .attr('y', (d) => y(d.row) + squareSize / 2);

            items
                .append('svg:tspan')
                .attr('x', (_, i) => x(i) + squareSize / 2)
                .attr('y', (d) => y(d.row) + squareSize / 2)
                .text((d, i) => {
                    return cpuLabels[d.row][i];
                });

            if (showValues) {
                items
                    .append('svg:tspan')
                    .attr('x', (_, i) => x(i) + squareSize / 2)
                    .attr(
                        'y',
                        (d) => y(d.row) + squareSize / 2 + squareSize / 3,
                    )
                    .attr('font-size', '.8em')
                    .text((d, i) => {
                        return (
                            millify(dataPlot[d.row][i], { precision: 2 }) +
                            valuesAdditionalText
                        );
                    });
            }

            const linearGradient = svg.current
                .append('defs')
                .append('linearGradient')
                .attr('x1', 0)
                .attr('x2', 0)
                .attr('y1', 0)
                .attr('y2', 1)
                .attr('id', gradientId);

            legendPoints.forEach((x) => {
                linearGradient
                    .append('stop')
                    .attr('offset', `${x}%`)
                    .attr('stop-color', legendColorScale(x));
            });

            svg.current
                .append('rect')
                .attr('x', width + margin + lengendMargin.left)
                .attr('y', 15)
                .attr('rx', 3)
                .attr('width', legendWidth)
                .attr('height', height - 30)
                .style('stroke', 'black')
                .style('stroke-width', 1)
                .attr('fill', `url(#${gradientId})`);

            svg.current
                .append('text')
                .attr('class', 'label-legend-min-max')
                .style('text-anchor', 'middle')
                .attr('font-weight', 400)
                .attr('font-size', 10)
                .attr(
                    'x',
                    () => width + margin + legendWidth / 2 + lengendMargin.left,
                )
                .attr('y', () => 12)
                .text(() => 'max');

            svg.current
                .append('text')
                .attr('class', 'label-legend-min-max')
                .style('text-anchor', 'middle')
                .attr('font-weight', 400)
                .attr('font-size', 10)
                .attr(
                    'x',
                    () => width + margin + legendWidth / 2 + lengendMargin.left,
                )
                .attr('y', () => height - 5)
                .text(() => 'min');
        }

        for (let i = 0; i < legendPoints.length; i++) {
            svg.current
                .append('text')
                .attr('class', 'label-legend')
                .style('text-anchor', legendPositions[i].anchor)
                .attr('font-weight', 400)
                .attr('font-size', 10)
                .attr(
                    'transform',
                    `translate(${
                        width + margin + legendWidth + lengendMargin.left + 5
                    },${legendPositions[i].p * (height - 30) + 15})rotate(90)`,
                )
                .text(() => {
                    if (legendLabels[i] === 'max') {
                        return (
                            millify(maxValue, { precision: 2 }) +
                            additionalLegendLabels[i]
                        );
                    } else if (legendLabels[i] === 'min') {
                        return (
                            millify(minValue, { precision: 2 }) +
                            additionalLegendLabels[i]
                        );
                    }
                    return legendLabels[i] + additionalLegendLabels[i];
                });
        }
    }, [sliderValue, dataPlot]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div>
            {title && <h3 className={classes.title}>{title}</h3>}
            <div className={classes.plotContainer} ref={plotRef}></div>
            <DownloadSvg svgNode={plotRef} />
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
                        Application execution time at <b>{sliderValue}</b> of{' '}
                        <b>{sliderConfig.max} sec.</b>
                    </p>
                </div>
            )}
        </div>
    );
}

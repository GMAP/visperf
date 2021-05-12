import React, { useRef, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import * as d3 from 'd3';

const useStyles = makeStyles((theme) => ({
    title: {
        textAlign: 'center',
        paddingBottom: theme.spacing(2),
    },
    plotContainer: {
        textAlign: 'center',
    },
}));

export default function CorePlot({ data, width = 300, height = 300 }) {
    const classes = useStyles();
    const plotRef = useRef();

    useEffect(() => {
        const colorScale = d3
            .scaleSequential(d3['interpolateYlOrRd'])
            .domain([0, 20]);

        const x = d3
            .scaleLinear()
            .range([0, width])
            .domain([0, data[0].length]);
        const y = d3.scaleLinear().range([0, height]).domain([0, data.length]);

        const svg = d3
            .select(plotRef.current)
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .append('g');

        const row = svg
            .selectAll('.row')
            .data(data)
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
            .attr('width', x(1))
            .attr('height', y(1))
            .style('fill', (d) => colorScale(d.value));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div>
            <h1 className={classes.title}>Cycles per CPU core</h1>
            <div className={classes.plotContainer} ref={plotRef}></div>
        </div>
    );
}

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

export default function TestPlot({ data }) {
    const classes = useStyles();
    const plotRef = useRef();

    useEffect(() => {
        let size = 500;
        let svg = d3
            .select(plotRef.current)
            .append('svg')
            .attr('width', size)
            .attr('height', size);
        let rect_width = 95;
        svg.selectAll('rect')
            .data(data)
            .enter()
            .append('rect')
            .attr('x', (_, i) => 5 + i * (rect_width + 5))
            .attr('y', (d) => size - d)
            .attr('width', rect_width)
            .attr('height', (d) => d)
            .attr('fill', 'teal');
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div>
            <h1 className={classes.title}>Cycles per CPU core</h1>
            <div className={classes.plotContainer} ref={plotRef}></div>
        </div>
    );
}

import React, { useRef, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import * as d3 from 'd3';
import _uniqueId from 'lodash/uniqueId';

const useStyles = makeStyles(() => ({
    container: {},
}));

export default function LegendColorScale({
    d3ColorScale,
    width,
    height,
    legendPoints,
    rotation = 90,
    margin = 10,
}) {
    const classes = useStyles();
    const legendRef = useRef();
    const [gradientId] = useState(_uniqueId('gradient-legend'));
    let svg = useRef(null);

    useEffect(() => {
        console.log(d3ColorScale, legendPoints);
        const colorScale = d3
            .scaleSequential(d3[d3ColorScale])
            .domain([legendPoints[0], legendPoints[legendPoints.length - 1]]);

        svg.current = d3
            .select(legendRef.current)
            .append('svg')
            .attr('width', width + margin * 2)
            .attr('height', height + margin * 2)
            .append('g')
            .attr('transform', 'translate(' + margin + ',' + margin + ')');

        const linearGradient = svg.current
            .append('defs')
            .append('linearGradient')
            .attr('id', gradientId)
            .attr('gradientTransform', `rotate(${rotation})`);

        legendPoints.forEach((x) => {
            linearGradient
                .append('stop')
                .attr('offset', `${x}%`)
                .attr('stop-color', colorScale(x));
        });

        svg.current
            .append('rect')
            .attr('x', 0)
            .attr('y', 0)
            .attr('rx', 3)
            .attr('width', width)
            .attr('height', height)
            .style('stroke', 'black')
            .style('stroke-width', 1)
            .style('fill', `url(#${gradientId})`);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div>
            <div className={classes.container} ref={legendRef}></div>
        </div>
    );
}

import React, { useRef, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import * as d3 from 'd3';
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
}));

export default function AreaPlot({
    data,
    title,
    xLabel,
    yLabel,
    width = 400,
    height = 150,
    margin = { top: 10, left: 10, bottom: 10, right: 10 },
}) {
    const classes = useStyles();
    const plotRef = useRef();
    let svg = useRef(null);

    useEffect(() => {
        const xData = Object.keys(data);
        const yData = Object.values(data);
        const dataPlot = [xData.map((d) => [+d, data[d]])];

        const xDomain = [Math.min(...xData), Math.max(...xData)];
        const x = d3.scaleLinear().range([0, width]).domain(xDomain);
        const y = d3
            .scaleLinear()
            .range([height, 0])
            .domain([0, Math.max(...yData)]);

        if (svg.current) {
            svg.current
                .selectAll('.x-axis')
                .transition()
                .duration(300)
                .call(d3.axisBottom(x));
            svg.current
                .selectAll('.y-axis')
                .transition()
                .duration(300)
                .call(
                    d3
                        .axisLeft(y)
                        .tickFormat((i) => millify(i, { precision: 2 })),
                );

            svg.current
                .selectAll('.area-path')
                .data(dataPlot)
                .transition()
                .duration(300)
                .attr(
                    'd',
                    d3
                        .area()
                        .x((d) => x(d[0]))
                        .y0(() => height)
                        .y1((d) => y(d[1])),
                );
        } else {
            svg.current = d3
                .select(plotRef.current)
                .append('svg')
                .attr('width', width + margin.left + margin.rigth)
                .attr('height', height + margin.top + margin.bottom)
                .append('g')
                .attr('transform', `translate(${margin.left},${margin.top})`);

            svg.current
                .append('g')
                .attr('class', 'x-axis')
                .attr('transform', `translate(0, ${height})`)
                .call(d3.axisBottom(x));
            svg.current
                .append('g')
                .attr('class', 'y-axis')
                .call(
                    d3
                        .axisLeft(y)
                        .tickFormat((i) => millify(i, { precision: 2 })),
                );

            svg.current
                .append('path')
                .data(dataPlot)
                .attr('class', 'area-path')
                .attr('fill', '#bf360c')
                .attr('fill-opacity', 0.5)
                .attr('stroke', '#bf360c')
                .attr('stroke-width', 1.5)
                .attr(
                    'd',
                    d3
                        .area()
                        .x((d) => x(d[0]))
                        .y0(() => height)
                        .y1((d) => y(d[1])),
                );

            svg.current
                .append('text')
                .attr('class', 'x label')
                .attr('text-anchor', 'middle')
                .attr('x', width / 2)
                .attr('y', height + 50)
                .text(xLabel);

            svg.current
                .append('text')
                .attr('class', 'y label')
                .attr('text-anchor', 'middle')
                .attr('y', -60)
                .attr('x', -(height / 2))
                .attr('transform', 'rotate(-90)')
                .text(yLabel);
        }
    }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div>
            {title && <h4 className={classes.title}>{title}</h4>}
            <div className={classes.plotContainer} ref={plotRef}></div>
            <DownloadSvg svgNode={plotRef} />
        </div>
    );
}

import React, { useRef, useEffect } from 'react';
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
}));

export default function AreaPlot({
    data,
    title,
    xLabel,
    yLabel,
    width = 400,
    height = 200,
    margin = { top: 10, left: 10, bottom: 10, right: 10 },
}) {
    const classes = useStyles();
    const plotRef = useRef();
    let svg = useRef(null);

    useEffect(() => {
        const xData = Object.keys(data);
        const yData = Object.values(data);

        const x = d3
            .scaleLinear()
            .range([0, width])
            .domain([Math.min(...xData), Math.max(...xData)]);
        const y = d3
            .scaleLinear()
            .range([height, 0])
            .domain([Math.min(...yData, 1), Math.max(...yData)]);

        if (svg.current) {
            svg.current.selectAll('path').remove();

            svg.current
                .append('g')
                .attr('transform', `translate(0, ${height})`)
                .call(
                    d3.axisBottom(x).ticks((x.domain()[1] - x.domain()[0]) / 2),
                );
            svg.current.append('g').call(d3.axisLeft(y));

            svg.current
                .append('path')
                .data([xData.map((d) => [+d, data[d]])])
                .attr('fill', '#cce5df')
                .attr('stroke', '#69b3a2')
                .attr('stroke-width', 2)
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
                .attr('transform', `translate(0, ${height})`)
                .call(
                    d3.axisBottom(x).ticks((x.domain()[1] - x.domain()[0]) / 2),
                );
            svg.current.append('g').call(d3.axisLeft(y));

            svg.current
                .append('path')
                .data([xData.map((d) => [+d, data[d]])])
                .attr('fill', '#cce5df')
                .attr('stroke', '#69b3a2')
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
                .attr('y', -50)
                .attr('x', -(height / 2))
                .attr('transform', 'rotate(-90)')
                .text(yLabel);
        }
    }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div>
            {title && <h4 className={classes.title}>{title}</h4>}
            <div className={classes.plotContainer} ref={plotRef}></div>
        </div>
    );
}

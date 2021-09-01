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
    sliderLabel: {
        marginTop: 0,
        textAlign: 'center',
    },
}));

export default function ParallelCoordinatePlot({
    data,
    numberCpus,
    title,
    dimensions,
    lineColor = '#bf360c',
    margin = { top: 10, left: 10, bottom: 10, right: 10 },
    width = 400,
    height = 400,
}) {
    const classes = useStyles();
    const plotRef = useRef();
    let svg = useRef(null);

    data = data.filter((_, i) => i < numberCpus);

    dimensions.forEach((d, i) => {
        const minMax = d3.extent(data, (d) => d[i]);
        d['scale'] = d3
            .scaleLinear()
            .domain([Math.min(0, minMax[0]), minMax[1]])
            .range(d.reverseScale ? [0, height] : [height, 0]);
    });

    useEffect(() => {
        const x = d3
            .scalePoint()
            .domain(dimensions.map((d) => d.name))
            .range([0, width]);

        const draw = (d) => {
            return d3.line()(
                dimensions.map((dimension, i) => {
                    return [x(dimension.name), dimension.scale(d[i])];
                }),
            );
        };
        const highlight = (d) => {
            svg.current
                .selectAll('.path')
                .transition()
                .duration(100)
                .style('stroke', '#000')
                .style('opacity', '0.1');
            d3.select(d.target)
                .transition()
                .duration(100)
                .style('stroke', lineColor)
                .style('opacity', '1');
        };
        const doNotHighlight = () => {
            d3.selectAll('.path')
                .transition()
                .duration(100)
                .style('stroke', lineColor)
                .style('opacity', '1');
        };

        if (svg.current) {
            const path = svg.current.selectAll('.path').data(data);
            path.transition().duration(300).attr('d', draw);

            const classDimension = svg.current
                .selectAll('.dimension')
                .data(dimensions);
            classDimension
                .transition()
                .duration(300)
                .attr('transform', (d) => 'translate(' + x(d.name) + ')')
                .each(function (d) {
                    d3.select(this).call(
                        d3
                            .axisLeft(d.scale)
                            .ticks(d.ticks)
                            .tickFormat((i) => {
                                if (d.hideLabels) {
                                    return;
                                }
                                if (d.labels) {
                                    return d.labels[i];
                                }
                                return millify(i, { precision: 2 });
                            }),
                    );
                })
                .attr('y', height + 30);
        } else {
            svg.current = d3
                .select(plotRef.current)
                .append('svg')
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .append('g')
                .attr('transform', `translate(${margin.left}, ${margin.top})`);

            svg.current
                .selectAll('myPath')
                .data(data)
                .enter()
                .append('path')
                .attr('class', (d) => `path item-${d[0]}`)
                .attr('d', draw)
                .style('fill', 'none')
                .style('stroke', lineColor)
                .style('stroke-width', 4)
                .on('mouseover', highlight)
                .on('mouseleave', doNotHighlight);

            svg.current
                .selectAll('myAxis')
                .data(dimensions)
                .enter()
                .append('g')
                .attr('class', 'dimension')
                .attr('transform', (d) => 'translate(' + x(d.name) + ')')
                .each(function (d) {
                    d3.select(this).call(
                        d3
                            .axisLeft(d.scale)
                            .ticks(d.ticks)
                            .tickFormat((i) => {
                                if (d.hideLabels) {
                                    return;
                                }
                                if (d.labels) {
                                    return d.labels[i];
                                }
                                return millify(i, { precision: 2 });
                            }),
                    );
                })
                .append('text')
                .attr('font-weight', 600)
                .attr('font-size', '1.1em')
                .style('text-anchor', 'middle')
                .attr('y', -20)
                .text((d) => d.name)
                .style('fill', 'black');
        }
    }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div>
            {title && <h3 className={classes.title}>{title}</h3>}
            <div className={classes.plotContainer} ref={plotRef}></div>
            <DownloadSvg svgNode={plotRef} />
        </div>
    );
}

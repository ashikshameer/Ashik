import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface RadarData {
  axis: string;
  value: number;
}

interface RadarChartProps {
  data: RadarData[][];
  width?: number;
  height?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  levels?: number;
  maxValue?: number;
}

export const RadarChart: React.FC<RadarChartProps> = ({
  data,
  width = 300,
  height = 300,
  margin = { top: 50, right: 50, bottom: 50, left: 50 },
  levels = 5,
  maxValue = 100,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const radius = Math.min(width / 2, height / 2);
    const allAxis = data[0].map((i) => i.axis);
    const total = allAxis.length;
    const angleSlice = (Math.PI * 2) / total;

    const g = svg
      .append('g')
      .attr('transform', `translate(${width / 2 + margin.left},${height / 2 + margin.top})`);

    // Circular grid
    for (let j = 0; j < levels; j++) {
      const levelRadius = (radius * (j + 1)) / levels;
      g.selectAll('.grid-circle-' + j)
        .data(allAxis)
        .enter()
        .append('line')
        .attr('x1', (d, i) => levelRadius * Math.cos(angleSlice * i - Math.PI / 2))
        .attr('y1', (d, i) => levelRadius * Math.sin(angleSlice * i - Math.PI / 2))
        .attr('x2', (d, i) => levelRadius * Math.cos(angleSlice * (i + 1) - Math.PI / 2))
        .attr('y2', (d, i) => levelRadius * Math.sin(angleSlice * (i + 1) - Math.PI / 2))
        .attr('class', 'stroke-outline-variant/30')
        .style('stroke-width', '0.5px');
    }

    // Axis lines
    const axis = g
      .selectAll('.axis')
      .data(allAxis)
      .enter()
      .append('g')
      .attr('class', 'axis');

    axis
      .append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', (d, i) => radius * Math.cos(angleSlice * i - Math.PI / 2))
      .attr('y2', (d, i) => radius * Math.sin(angleSlice * i - Math.PI / 2))
      .attr('class', 'stroke-outline-variant/50')
      .style('stroke-width', '1px');

    // Labels
    axis
      .append('text')
      .attr('class', 'fill-on-surface/60 text-[10px] font-bold uppercase tracking-tighter')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('x', (d, i) => (radius + 20) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr('y', (d, i) => (radius + 20) * Math.sin(angleSlice * i - Math.PI / 2))
      .text((d) => d as string);

    // Radar areas
    const radarLine = d3
      .lineRadial<RadarData>()
      .radius((d) => (d.value / maxValue) * radius)
      .angle((d, i) => i * angleSlice)
      .curve(d3.curveLinearClosed);

    data.forEach((d, i) => {
      const color = i === 0 ? '#6366f1' : '#10b981'; // primary and secondary colors
      
      g.append('path')
        .datum(d)
        .attr('d', radarLine)
        .attr('class', i === 0 ? 'fill-primary/20 stroke-primary' : 'fill-secondary/20 stroke-secondary')
        .style('stroke-width', '2px')
        .style('fill-opacity', 0.4);

      // Add dots at vertices
      g.selectAll('.radar-dot-' + i)
        .data(d)
        .enter()
        .append('circle')
        .attr('cx', (point: RadarData, idx: number) => (point.value / maxValue) * radius * Math.cos(angleSlice * idx - Math.PI / 2))
        .attr('cy', (point: RadarData, idx: number) => (point.value / maxValue) * radius * Math.sin(angleSlice * idx - Math.PI / 2))
        .attr('r', 4)
        .attr('class', i === 0 ? 'fill-primary' : 'fill-secondary')
        .style('stroke', '#fff')
        .style('stroke-width', '2px');
    });
  }, [data, width, height, margin, levels, maxValue]);

  return (
    <svg
      ref={svgRef}
      width={width + margin.left + margin.right}
      height={height + margin.top + margin.bottom}
      className="overflow-visible"
    />
  );
};

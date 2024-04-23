import { DataSet } from '@/app/types/dataSet';
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function D3Chart({ datasets }: { datasets: DataSet[] }) {
	const d3Container = useRef<SVGSVGElement | null>(null);

	useEffect(() => {
		if (!d3Container.current) return;

		const svg = d3.select(d3Container.current);

		svg.selectAll('*').remove();

		const margin = { top: 20, right: 30, bottom: 30, left: 40 };
		const width = 300 - margin.left - margin.right;
		const height = 300 - margin.top - margin.bottom;

		const xScale = d3.scaleLinear().domain([0, 1]).range([0, width]);
		const yScale = d3.scaleLinear().domain([0, 1]).range([height, 0]);

		const xAxis = d3.axisBottom(xScale);
		const yAxis = d3.axisLeft(yScale);

		svg
			.append('g')
			.attr('transform', `translate(${margin.left}, ${height + margin.top})`)
			.call(xAxis)
			.selectAll('path')
			.style('stroke', 'rgb(209 213 219)')
			.style('stroke-width', '2px');

		svg
			.append('g')
			.attr('transform', `translate(${margin.left}, ${height + margin.top})`)
			.call(xAxis)
			.selectAll('text')
			.style('fill', 'rgb(209 213 219)');

		svg
			.append('g')
			.attr('transform', `translate(${margin.left}, ${margin.top})`)
			.call(yAxis)
			.selectAll('path')
			.style('stroke', 'rgb(209 213 219)')
			.style('stroke-width', '2px');

		svg
			.append('g')
			.attr('transform', `translate(${margin.left}, ${margin.top})`)
			.call(yAxis)
			.selectAll('text')
			.style('fill', 'rgb(209 213 219)');

		const line = d3
			.line()
			.x(d => xScale(d[0]))
			.y(d => yScale(d[1]))
			.curve(d3.curveMonotoneX);

		const colors = ['steelblue', 'red'];

		datasets.forEach((set, i) => {
			svg
				.append('path')
				.datum(set.data)
				.attr('fill', 'none')
				.attr('stroke', colors[i])
				.attr('stroke-width', 1.5)
				.attr('d', line)
				.attr('transform', `translate(${margin.left}, ${margin.top})`);
		});
	}, [datasets]);

	return <svg width="300" height="300" ref={d3Container} />;
}

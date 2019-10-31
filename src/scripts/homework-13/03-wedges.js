import * as d3 from 'd3'

const margin = { top: 30, left: 30, right: 30, bottom: 30 }
const height = 400 - margin.top - margin.bottom
const width = 780 - margin.left - margin.right

const svg = d3
  .select('#chart-3')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', `translate(${width / 2},${height / 2})`)

const pie = d3.pie().value(Math.PI / 12)

const radius = 100

const radiusScale = d3
  .scaleLinear()
  .domain([0, 100])
  .range([0, radius])

const arc = d3
  .arc()
  .innerRadius(0)
  .outerRadius(d => radiusScale(d.data.high_temp))

const labelArc = d3
  .arc()
  .innerRadius(0)
  .outerRadius(d => radiusScale(d.data.high_temp + 20))

const colorScale = d3
  .scaleOrdinal()
  .range(['#feebe2', '#fbb4b9', '#f768a1', '#c51b8a', '#7a0177'])

const xPositionScale = d3.scaleBand().range([0, width])

d3.csv(require('/data/ny-temps.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(datapoints) {
  svg
    .selectAll('path')
    .data(pie(datapoints))
    .enter()
    .append('path')
    .attr('d', d => arc(d))
    .attr('fill', d => colorScale(d.data.high_temp))
}

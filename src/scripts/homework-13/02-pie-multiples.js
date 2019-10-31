import * as d3 from 'd3'

const margin = { top: 30, left: 30, right: 30, bottom: 30 }
const height = 400 - margin.top - margin.bottom
const width = 780 - margin.left - margin.right

const svg = d3
  .select('#chart-2')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')

const pie = d3
  .pie()
  .value(function(d) {
    return d.minutes
  })
  .sort(null)

const radius = 70

const arc = d3
  .arc()
  .innerRadius(0)
  .outerRadius(radius)

const colorScale = d3.scaleOrdinal().range(['orange', 'purple', 'green'])

const xPositionScale = d3.scaleBand().range([0, width])

d3.csv(require('/data/time-breakdown-all.csv'))
  .then(ready)
  .catch(err => console.log('Failed with', err))

function ready(datapoints) {
  const nested = d3
    .nest()
    .key(function(d) {
      return d.project
    })
    .entries(datapoints)
  const keys = nested.map(d => d.key)
  xPositionScale.domain(keys)

  svg
    .selectAll('.pie-graph')
    .data(nested)
    .enter()
    .each(function(d) {
      const graphX = xPositionScale(d.key) + 90

      const container = d3
        .select(this)
        .append('g')
        .attr('transform', `translate(${graphX},${height / 2})`)

      container
        .selectAll('path')
        .data(pie(d.values))
        .enter()
        .append('path')
        .attr('d', d => arc(d))
        .attr('fill', d => colorScale(d.data.task))

      container
        .datum(d)
        .append('text')
        .text(d.key)
        .attr('y', 90)
        .attr('text-anchor', 'middle')
        .attr('font-size', 20)
    })
}

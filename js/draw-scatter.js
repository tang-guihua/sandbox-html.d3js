async function x() {
    const pathToJSON = await d3.json("../data/seattle_wa_weather_data.json")
    // console.log(pathToJSON[20])

    const xAccessor = d => d.dewPoint
    const yAccessor = d => d.humidity

    const width = d3.min([
      window.innerwidth * 0.9,
      window.innerHeight * 0.9
    ])

    let dimensions = {
      width: width,
      height: width,
        margin: {
          top: 10,
          right: 10,
          bottom: 50,
          left: 50
        }
    }

    dimensions.boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right
    dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom

    const wrapper = d3.select('#wrapper')
        .append('svg')
        .attr('height', dimensions.width)
        .attr('width', dimensions.height)

    const bounds = wrapper.append('g')
        .style('transform', `translate(${
          dimensions.margin.left
        }px, ${
          dimensions.margin.top
        }px)`)
    
    const xScale = d3.scaleLinear()
        .domain(d3.extent(pathToJSON, xAccessor))
        .range([0, dimensions.boundedWidth])
        .nice()
    const yScale = d3.scaleLinear()
        .domain(d3.extent(pathToJSON, yAccessor))
        .range([dimensions.boundedHeight, 0])
        .nice()
    
    function drawDots(dataSet, color) {
      const dots = bounds.selectAll('circle')
        .data(dataSet)
        dots
        .join('circle')
        .attr('cx', d => xScale(xAccessor(d)))
        .attr('cy', d => yScale(yAccessor(d)))
        .attr('r', 3)
        .attr('fill', d => colorRange(colorAccess(d)))
    }
    

    const xAxisGenerator = d3.axisBottom()
        .scale(xScale)
    const xAxis = bounds.append('g')
        .call(xAxisGenerator)
        .style('transform', `translateY(${dimensions.boundedHeight}px)`)

    const yAxisGenerator = d3.axisLeft()
        .scale(yScale)
    const yAxis = bounds.append('g')
        .call(yAxisGenerator)
    
    const xText = xAxis.append('text')
        .attr('x', dimensions.boundedWidth / 2)
        .attr('y', dimensions.margin.bottom - 15)
        .attr('fill', 'black')
        .style('font-size', '1.2em')
        .html('Dew point (def)')
    
    const yText = yAxis.append('text')
        .attr('y', -dimensions.margin.left + 10)
        .attr('x', -dimensions.boundedHeight / 2)
        .attr('fill', 'black')
        .attr('font-size', '1.2em')
        .html('Relative humidity')
        .style('transform', 'rotate(-90deg)')
        .style('text-anchor', 'middle')

    const colorAccess = d => d.cloudCover

    const colorRange = d3.scaleLinear()
        .domain(d3.extent(pathToJSON, colorAccess))
        .range(["skyblue", "darkslategrey"])

    drawDots(pathToJSON)
}

x()
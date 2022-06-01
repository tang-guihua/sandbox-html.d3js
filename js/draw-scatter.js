async function x() {
    const pathToJSON = await d3.json("../data/seattle_wa_weather_data.json")
    // console.log(pathToJSON[1])

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

    // bounds.append('circle')
    //     .attr('cx', dimensions.boundedWidth / 2)
    //     .attr('cy', dimensions.boundedHeight / 2)
    //     .attr('r', 5)
    
    // pathToJSON.forEach(d => {
    //   bounds
    //     .append('circle')
        // .attr('cx', xScale(xAccessor(d)))
        // .attr('cy', yScale(yAccessor(d)))
        // .attr('r', 5)
    // })

    // const dots = bounds.selectAll('circle')
    //     .data(pathToJSON)
    //     .enter()
    //     .append('circle')
    //     .attr('cx', d => xScale(xAccessor(d)))
    //     .attr('cy', d => yScale(yAccessor(d)))
    //     .attr('r', 3)
    //     .attr("fill", "cornflowerblue")
    
    function drawDots(dataSet, color) {
      const dots = bounds.selectAll('circle')
        .data(dataSet)
        .enter()
        .append('circle')
        .attr('cx', d => xScale(xAccessor(d)))
        .attr('cy', d => yScale(yAccessor(d)))
        .attr('r', 3)
        .attr('fill', color)
    }
    drawDots(pathToJSON.slice(0, 200), 'darkgrey')

    setTimeout(() => {
      drawDots(pathToJSON, "cornflowerblue")
    }, 1000);
}

x()
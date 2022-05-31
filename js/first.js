const rectWidth = 50
const svgHeight = 100
const contnet = d3.select('#contnet')

const svg = contnet.append('svg')
                  .attr('height', svgHeight)
                  .style('overflow', 'visible')
const buttonCode = contnet.append('div')
      buttonCode.append('button')
                .text('new data!')
      buttonCode.append('code')
      buttonCode.on("click", () => {
          updateBars()
      })

const buttonselect = document.getElementsByTagName('button')
                             
function updateBars() {
      const t = d3.transition().duration(350).ease(d3.easeLinear)
      const data = _.times(_.random(3, 8), i => _.random(0, 100))
      d3.select(svg.node()).selectAll('rect')
        .data(data, d => d)
        .join(
            enter => {
            return enter.append('rect')
                        .attr('x', (d, i) => { return (i * rectWidth) })
                        .attr('height', 0)
                        .attr('y', svgHeight)
                        .attr('fill', 'pink')
                        .attr('stroke', 'plum')
                        .attr('fill-opacity', 0.75)
            },
        updata => updata,
        exit => {
            exit.transition(t)
                .attr('height', 0)
                .attr('y', svgHeight)
            }
        )
        .attr('width', rectWidth)
        .transition(t)
        .attr('height', d => { return d })
        .attr('y', d => { return (svgHeight - d) })
        .attr('x', (d, i) => { return (i * rectWidth) })
        .attr('stroke', 'plum')
        .attr('fill-opacity', 0.75)
      d3.select('code').text(JSON.stringify(data).replace(/\,/g, ', '))
    }
updateBars()

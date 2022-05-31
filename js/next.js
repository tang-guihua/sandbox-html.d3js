const width = window.innerWidth
const height = window.innerHeight
const petalColors = ['#ffc8f0', '#cbf2bd', '#afe9ff', '#ffb09e']
const topGenres = ["Action", "Comedy", "Animation", "Drama"]
const petalPaths = [
                    'M0 0 C50 50 50 100 0 100 C-50 100 -50 50 0 0',
                    'M-35 0 C-25 25 25 25 35 0 C50 25 25 75 0 100 C-25 75 -50 25 -35 0',
                    'M0,0 C50,40 50,70 20,100 L0,85 L-20,100 C-50,70 -50,40 0,0',
                    'M0 0 C50 25 50 75 0 100 C-50 75 -50 25 0 0',
                       ]
function calculateData(movies) {
      const colorScale = d3
        .scaleOrdinal()
        .domain(topGenres)
        .range(petalColors)
        .unknown("#fff2b4")

      const petalScale = d3
        .scaleOrdinal()
        .range(petalPaths)

      const sizeScale = d3
        .scaleLinear()
        .domain(d3.extent(movies, (d) => d.rating))
        .range([0.1, 0.6])

      const numPetalScale = d3
      .scaleQuantize()
      .domain(d3.extent(movies, (d) => d.votes))
      .range(_.range(5, 10))

      return _.map(movies, (d, i) => {
        return {
          title: d.title,
          color: colorScale(d.genres[0]),
          path : petalScale(d.rated),
          scale: sizeScale(d.rating),
          numPetals: numPetalScale(d.votes)
        }
      })
    }

function calculateGraph(movies, flowers, prevGraph) {
      const genres = {}
      const nodes = []
      const Links = []

      _.forEach(movies, function(d, i) {
        let flower = prevGraph && _.find(prevGraph.nodes,(title) => title === d.title)
        flower = flower || flowers[i]
        nodes.push(flower)
      
      _.forEach(d.genres, function(Genre){
          if (prevGraph) {
            genres[Genre] = _.find(prevGraph.genres, ({label}) => label === Genre )
          }
          if (!genres[Genre]) {
            genres[Genre] = {
              label: Genre,
              size: 0
            }
          }
        genres[Genre].size += 1

          Links.push({
            source: genres[Genre],
            target: flower,
            id: `${Genre}-movie${i}`
          })
        })
      })
      return {nodes, genres: _.values(genres), Links}
    }

    d3.json('a.json').then( a => {
      const mov = _.values(a)
      const movies = _.chain(mov).map(d => {
          return {
          title: d.Title,
          released: new Date(d.Released),
          genres: d.Genre.split(', '),
          rating: +d.imdbRating,
          votes: +(d.imdbVotes.replace(/,/g, '')),
          rated: d.Rated,
          }   
        }).sortBy(d => -d.released).value()
console.log(movies)
      const flowers = calculateData(movies)
      const graph = calculateGraph(movies, flowers)
      console.log(graph)
      const svg = d3.select('svg')
                    .attr('width', width)
                    .attr('height', height)
      // our code here
      const link = svg.selectAll(".link")
          .data(graph.Links, (d) => d.id)
          .join("line")
          .classed('link', true)
          .attr('stroke', '#ccc')
          .attr('opacity', 0.5)
      //创建花
      const flower = svg.selectAll('g')
          .data(graph.nodes, (d) => d.title)
          .join((enter) => {
            const g = enter.append('g')

            //create paths & text
            g.selectAll('path')
             .data((d) => 
              _.times(d.numPetals, (i) => {
                return { rotate: i * (360 / d.numPetals), ...d}}))
             .join('path')
             .attr('transform', d => `rotate(${d.rotate})scale(${d.scale})`)
             .attr('d', (d) => d.path)
             .attr('fill', (d) => d.color)
             .attr('stroke', (d) => d.color)
             .attr('fill-opacity', 0.35)
             .attr('stroke-width', 2)

            g.append('text')
             .attr('text-anchor', 'middle')
             .style('font-size', '.7em')
             .attr('dy', '.35em')
             .text( d => _.truncate(d.title, 18) )
              
              return g
            }
          )
      //genres
      const genres = svg.selectAll('.genre')
        .data(graph.genres, (d) => d.label)
        .join('text')
        .classed('genre', true)
        .text((d) => d.label)
        .attr('text-anchor', 'midddle')

      //use force simulation
      const nodes = _.union(graph.nodes, graph.genres)
      const simulation = d3
        .forceSimulation(nodes)
        .force('link', d3.forceLink(graph.Links))
        .force(
          'collide', 
          d3.forceCollide( d => d.scale * 100)
        )
        .force('center', d3.forceCenter(width /2, width / 4))
        .on('tick', () => {
          flower.attr('transform', (d) => `translate(${d.x}, ${d.y})`)
          genres.attr('transform', (d) => `translate(${d.x}, ${d.y})`)
          link.attr('x1', (d) => d.source.x)
              .attr('y1', (d) => d.source.y)
              .attr('x2', (d) => d.target.x)
              .attr('y2', (d) => d.target.y)
        })
    })
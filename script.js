let url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json';
let req = new XMLHttpRequest()

let values = []

let xScale
let yScale

let width = 800
let height = 600
let padding = 40

let svg = d3.select('svg')
let tooltip = d3.select('#tooltip') // we are declairing a tooltip to show details when we hover the dots
// canvas area where the graph is displayed
let drawCanvas = () => {
    svg.attr('width',width)
    svg.attr('height', height)
}
// scale generator function
let generateScales = () => {

    xScale = d3.scaleLinear()
                .domain([d3.min(values, (d) => d['Year'] - 1), d3.max(values, (d) => d['Year'] + 1)])
                .range([padding, width - padding])

    yScale = d3.scaleTime()
                .domain([d3.min(values, (d) => new Date(d['Seconds'] * 1000)), d3.max(values, (d) => new Date(d['Seconds'] * 1000))])
                .range([padding, height - padding])
}
// function where points/circles are generated 
let drawPoints = () => {

    svg.selectAll('circle')
        .data(values)
        .enter()
        .append('circle')
        .attr('class', 'dot')
        .attr('r','5')
        .attr('data-xvalue', (d) => d['Year'])
        .attr('data-yvalue', (d) => new Date(d['Seconds'] * 1000))
        .attr('cx', (d) => xScale(d['Year'])) // spreading the circles on the graph x axis
        .attr('cy', (d) => yScale(new Date(d['Seconds'] * 1000))) // spreading the circles on the graph y axis
        .attr('fill', (d) => {
            if (d['Doping'] != '') {
                return 'orange'
            } 
             return 'green'
        })
        .on('mouseover', (d) => {
            tooltip.transition()
                    .style('visibility', 'visible')

                    if(d['Doping'] != ""){
                        tooltip.text(d['Year'] + ' - ' + d['Name'] + ' - ' + d['Time'] + ' - ' + d['Doping'])
                    }else{
                        tooltip.text(d['Year'] + ' - ' + d['Name'] + ' - ' + d['Time'] + ' - ' + 'No Allegations')
                    }
                    
                    tooltip.attr('data-year', d['Year'])
                })
        .on('mouseout', (d) => {
            tooltip.transition()
                    .style('visibility','hidden')
        })
}
// function where the axis are made and adjusted up/down left/right 
let generateAxes = () => {

    let xAxis = d3.axisBottom(xScale)
                    .tickFormat(d3.format('d')) // this method gets rid of comma in the year number 'd' will round up to decimels

    svg.append('g')
        .call(xAxis)
        .attr('id', 'x-axis')
        .attr('transform', `translate(0, ${height - padding})`) // or ('transform', 'translate(0, ' + (height - padding) + ')')

    let yAxis = d3.axisLeft(yScale)
                    .tickFormat(d3.timeFormat('%M:%S'))

    svg.append('g')
        .call(yAxis)
        .attr('id', 'y-axis')
        .attr('transform', `translate(${padding}, 0)`) // or 'translate(' + padding + ', 0)
}

req.open('GET',url,true)
req.onload = () => {
    // console.log(req.responseText);
    values = JSON.parse(req.responseText)
    console.log(values);
    drawCanvas()
    generateScales()
    drawPoints()
    generateAxes()
}
req.send()
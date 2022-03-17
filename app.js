document.addEventListener('DOMContentLoaded', function () {
    let getShortDate = (date) => {
        year = date.getFullYear()
        month = date.getMonth()+1
        day = date.getDate()
        if (month < 10) [
            month = '0' + month
        ]
        if (day < 10) [
            day = '0' + day
        ]
        return year + '-' + month + '-' + day
    }

    d3.select('body')
        .append('div')
        .attr('id', 'tooltip')

    fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
        .then(response => response.json())
        .then(data => {
            let dataset = []
            data.data.forEach(date_value_arr => {
                dataset.push([new Date(date_value_arr[0]), date_value_arr[1]])
            });

            const w = 1000;
            const h = 750;
            const padding = 60;
            const minx = d3.min(dataset, (d) => d[0])
            const maxx = d3.max(dataset, (d) => d[0])
            const maxy = d3.max(dataset, (d) => d[1])
            const xScale = d3.scaleTime()
                .domain([minx, maxx])
                .range([padding, w - padding]);

            const yScale = d3.scaleLinear()
                .domain([0, maxy])
                .range([h - padding, padding]);

            const svgArea = d3.select(".chartcontainer")
                .append("svg")
                .attr("width", w)
                .attr("height", h);

            svgArea.selectAll("rect")
                .data(dataset)
                .enter()
                .append("rect")
                .attr("class", "bar")
                .attr("x", (d) => xScale(d[0]))
                .attr("y", (d) => yScale(d[1]))
                .attr("width", 3)
                .attr("height", (d) => yScale(0) - yScale(d[1]))
                .attr("data-date", (d) => getShortDate(d[0]))
                .attr("data-gdp", (d) => d[1])
                .attr("fill", "navy")
                .on("mouseover", (e, d) => {
                    d3.select("#tooltip")
                        .html(tooltip_info_str(d))
                        .attr("data-date", getShortDate(d[0]))
                        .transition()
                        .duration(200)
                        .style("opacity", 0.9)
                })
                .on('mouseout', function(e) {
                    d3.select('#tooltip').transition()
                    .duration(200).style('opacity', 0)
                    })
                .on('mousemove', function(e) {
                        d3.select('#tooltip')
                        .style('left', (e.pageX+10) + 'px')
                        .style('top', (e.pageY+10) + 'px')
                        })
                        
            svgArea
                .append('text')
                .text('United States GDP')
                .attr('x', w * 0.35)
                .attr('y', h * 0.15)
                .attr('id', 'title')

            svgArea
                .append('text')
                .text('Gross Domestic Product')
                .attr('transform', 'rotate(-90)')
                .attr('x', -420)
                .attr('y', 80)

            svgArea
                .append('text')
                .text('Data source: https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
                .attr('x', w * 0.23)
                .attr('y', h - 20)
                .attr('class', 'footer-info')

            const xAxis = d3.axisBottom(xScale);
            const yAxis = d3.axisLeft(yScale);

            svgArea.append("g")
                .call(xAxis)
                .attr("transform", "translate(0," + (h - padding) + ")")
                .attr('id', 'x-axis')

            svgArea.append("g")
                .call(yAxis)
                .attr("transform", "translate(" + padding + ", 0)")
                .attr('id', 'y-axis')

            let tooltip_info_str = (d) => {
                let date = d[0]
                let value = d[1]
                let quarter = ''
                switch (date.getMonth()) {
                    case 0:
                        quarter = 'Q1'
                        break
                    case 3:
                        quarter = 'Q2'
                        break
                    case 6:
                        quarter = 'Q3'
                        break
                    case 9:
                        quarter = 'Q4'
                        break
                }
                return date.getFullYear() + ' ' + quarter + '<br/>' + '$' + value + " Billion"
            }
        })
})
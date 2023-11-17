import * as d3 from 'd3';

export class lineChart {

    render = function (jsonData) {

        const width = 928;
        const height = 500;
        const marginTop = 20;
        const marginRight = 30;
        const marginBottom = 30;
        const marginLeft = 40;

        const aapl = JSON.parse(jsonData);

        // Declare the x (horizontal position) scale.
        // const x = d3.scaleUtc()
        //     .domain([new Date("2019-01-01"), new Date("2023-01-01")])
        //     .range([marginLeft, width - marginRight]);

        // const chartWidth = width - marginLeft - marginRight;

        const x = d3.scaleTime()
            .domain(d3.extent(aapl, d => new Date(d.Month)))
            .range([marginLeft, width - marginRight]);


        // Declare the y (vertical position) scale.
        const y = d3.scaleLinear()
            .domain([0, d3.max(aapl, d => d['Billable Hits'])])
            .range([height - marginBottom, marginTop]);

        const yMin = d3.min(aapl, d => d['Billable Hits']);
        const yMax = d3.max(aapl, d => d['Billable Hits']);


        // Declare the line generator.
        const line = d3.line()
            .x(d => x(new Date(d.Month)))
            .y(d => y(d['Billable Hits']));

        // Create the SVG container.
        const svg = d3.create("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [0, 0, width, height])
            .attr("style", "max-width: 100%; height: auto; height: intrinsic;")

        // Add the x-axis.
        svg.append("g")
            .attr("transform", `translate(0,${height - marginBottom})`)
            .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));

        // Add minimum and maximum value for y
        svg.append("text")
            .attr("x", marginLeft)
            .attr("y", y(yMax))
            .attr("text-anchor", "start")
            .text(`Max: ${yMax}`)

        svg.append("text")
            .attr("x", marginLeft)
            .attr("y", y(yMin) - 30)
            .attr("text-anchor", "start")
            .text(`Min: ${yMin}`)

        // Append a path for the line.
        svg.append("path")
            .datum(aapl)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", line);

        //create tooltip
        const tooltip = d3.select('body')
            .append('div')
            .attr('class', 'tooltip')
            .style('opacity', 0);

        const verticalLine = svg.append('line') //lines for the crosshair
            .attr('class', 'vertical-line')
            .style('stroke', '#ccc')
            .style('stroke-dasharray', '3,3')
            .style('opacity', 0);

        const horizontalLine = svg.append('line')
            .attr('class', 'horizontal-line')
            .style('stroke', '#ccc')
            .style('stroke-dasharray', '3,3')
            .style('opacity', 0);

        // Create an overlay to capture mouse events
        svg.append('rect')
            .attr('class', 'overlay')
            .attr('width', width)
            .attr('height', height)
            .style('fill', 'none')
            .style('pointer-events', 'all')
            .on('mouseover', () => {
                tooltip.style('opacity', 1);
                verticalLine.style('opacity', 1);
                horizontalLine.style('opacity', 1);
            })
            .on('mouseout', () => {
                tooltip.style('opacity', 1);
                verticalLine.style('opacity', 1);
                horizontalLine.style('opacity', 1);
            })
            .on('mousemove', mousemove);

        function mousemove(event) {
            // Calculate the x value from the x-scale inverted from the mouse position
            const bisectDate = d3.bisector(d => new Date(d.Month)).left;
            const x0 = x.invert(d3.pointer(event, svg.node())[0]);
            const i = bisectDate(aapl, x0, 1);
            const d0 = aapl[i - 1];
            const d1 = aapl[i];
            const d = x0 - new Date(d0.Month) > new Date(d1.Month) - x0 ? d1 : d0;

            // Display tooltip with x and y values
            tooltip.html(`<strong>Date:</strong> ${d.Month}<br/><strong>Billable Hits:</strong> ${d['Billable Hits']}`)
                .style('left', (event.pageX) + 'px')
                .style('top', (event.pageY - 28) + 'px');

            // Update crosshair position
            const xPos = x(new Date(d.Month));

            verticalLine.attr('x1', xPos)
                .attr('x2', xPos)
                .attr('y1', marginTop)
                .attr('y2', height - marginBottom);

            const yPos = y(d['Billable Hits']);

            horizontalLine.attr('x1', marginLeft)
                .attr('x2', width - marginRight)
                .attr('y1', yPos)
                .attr('y2', yPos);
        }

        return svg.node();
    }
}
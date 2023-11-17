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

        // sets margin for both charts
        const focusChartMargin = {
            top: 20,
            right: 20,
            bottom: 170,
            left: 60
        }

        const contextChartMargin = {
            top: 360,
            right: 20,
            bottom: 90,
            left: 60
        }

        // width of both charts
        const chartWidth = width - focusChartMargin.left - focusChartMargin.right;

        // height of either chart
        const focusChartHeight = height - focusChartMargin.top - focusChartMargin.bottom;
        const contextChartHeight = height - contextChartMargin.top - contextChartMargin.bottom;

        const svg = d3.create("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [0, 0, width, height])
            .attr("style", "max-width: 100%; height: auto; height: intrinsic;")

        svg.append("svg")
            .attr("width", chartWidth + focusChartMargin.left + focusChartMargin.right)
            .attr("height", focusChartHeight + focusChartMargin.top + focusChartMargin.bottom)
            .append("g")
            .attr("transform", "translate(" + focusChartMargin.left + "," + focusChartMargin.top + ")")

        const parseTime = d3.timeFormat("%Y-%m")

        const dates = [];
        for (let key of Object.keys(aapl)) {
            (bucketRecord => {
                dates.push(parseTime(bucketRecord.Month));
            });
        }

        const yMin = d3.min(aapl, d => d['Billable Hits']);
        const yMax = d3.max(aapl, d => d['Billable Hits']);

        // height for both y-axis
        const yFocus = d3.scaleLinear().range([focusChartHeight, 0]);
        const yContext = d3.scaleLinear().range([contextChartHeight, 0]);

        // width for both x-axis
        const xFocus = d3.scaleTime().range([0, chartWidth]);
        const xContext = d3.scaleTime().range([0, chartWidth]);

        const xAxisFocus = d3.axisBottom(xFocus)
            .ticks(10);

        const xAxisContext = d3.axisBottom(xContext)
            .ticks(10);

        const yAxisFocus = d3.axisLeft(yFocus);

        // build brush

        const brush = d3.brushX().extent([
            [0, -10],
            [chartWidth, contextChartHeight],
        ])
            .on("brush end", brushed);

        // zoom
        const zoom = d3.zoom().scaleExtent([1, Infinity]).translateExtent([
            [0, 0],
            [chartWidth, focusChartHeight],
        ])
            .on("zoom", zoomed)
            .filter(() => d3.event.ctrlKey || d3.event.type === "dblclick" || d3.event.type === "mousedown");

        // create a line for focus chart
        const lineFocus = d3
            .line()
            .x(d => xFocus(parseTime(d.Month)))
            .y(d => yFocus(d['Billable Hits']));

        const lineContext = d3
            .line()
            .x(d => xContext(parseTime(d.Month)))
            .y(d => yContext(d['Billable Hits']));

        const clip = svg
            .append("defs")
            .append("svg:clipPath")
            .attr("id", "clip")
            .append("svg:rect")
            .attr("width", chartWidth)
            .attr("height", focusChartHeight)
            .attr("x", 0)
            .attr("y", 0);

        const focusChartLines = svg
            .append("g")
            .attr("class", "focus")
            .attr("transform", "translate(" + focusChartMargin.left + "," + focusChartMargin.top + ")")
            .attr("clip-path", "url(#clip)");

        const focus = svg
            .append("g")
            .attr("class", "focus")
            .attr("transform", "translate(" + focusChartMargin.left + "," + focusChartMargin.top + ")");

        // create context chart
        const context = svg
            .append("g")
            .attr("class", "context")
            .attr("transform", "translate(" + contextChartMargin.left + "," + (contextChartMargin.top + 50) + ")");

        // add data info to axis
        xFocus.domain(d3.extent(dates));
        yFocus.domain([0, yMax]);
        xContext.domain(d3.extent(dates));
        yContext.domain(yFocus.domain());

        // add axis to focus chart
        focus
            .append("g")
            .attr("class", "x-axis")
            .attr("transform", "translate(0," + focusChartHeight + ")")
            .call(xAxisFocus);
        focus
            .append("g")
            .attr("class", "y-axis")
            .call(yAxisFocus);

        // get list of bucket names
        const bucketNames = [];
        for (let key of Object.keys(aapl)) {
            bucketNames.push(key);
        }

        // go through data and create/append lines to both charts
        for (let key of Object.keys(aapl)) {
            let bucket = aapl[key];
            focusChartLines
                .append("path")
                .datum(bucket)
                .attr("class", "line")
                .attr("fill", "none")
                .attr("stroke-width", 1.5)
                .attr("d", lineFocus);
            context
                .append("path")
                .datum(bucket)
                .attr("class", "line")
                .attr("fill", "none")
                .attr("stroke-width", 1.5)
                .attr("d", lineContext);
        }

        // add x axis to context chart (y axis is not needed)
        context
            .append("g")
            .attr("class", "x-axis")
            .attr("transform", "translate(0," + contextChartHeight + ")")
            .call(xAxisContext);

        // add bush to context chart
        const contextBrush = context
            .append("g")
            .attr("class", "brush")
            .call(brush);

        // style brush resize handle
        const brushHandlePath = d => {
            const e = +(d.type === "e"),
                x = e ? 1 : -1,
                y = contextChartHeight + 10;
            return (
                "M" +
                0.5 * x +
                "," +
                y +
                "A6,6 0 0 " +
                e +
                " " +
                6.5 * x +
                "," +
                (y + 6) +
                "V" +
                (2 * y - 6) +
                "A6,6 0 0 " +
                e +
                " " +
                0.5 * x +
                "," +
                2 * y +
                "Z" +
                "M" +
                2.5 * x +
                "," +
                (y + 8) +
                "V" +
                (2 * y - 8) +
                "M" +
                4.5 * x +
                "," +
                (y + 8) +
                "V" +
                (2 * y - 8)
            );
        };

        const brushHandle = contextBrush
            .selectAll(".handle--custom")
            .data([{ type: "w" }, { type: "e" }])
            .enter()
            .append("path")
            .attr("class", "handle--custom")
            .attr("stroke", "#000")
            .attr("cursor", "ew-resize")
            .attr("d", brushHandlePath);

        // overlay the zoom area rectangle on top of the focus chart
        svg
            .append("rect")
            .attr("cursor", "move")
            .attr("fill", "none")
            .attr("pointer-events", "all")
            .attr("class", "zoom")
            .attr("width", chartWidth)
            .attr("height", focusChartHeight)
            .attr("transform", "translate(" + focusChartMargin.left + "," + focusChartMargin.top + ")")
            .call(zoom);

        contextBrush.call(brush.move, [0, chartWidth / 2]);


        // focus chart x label
        focus
            .append("text")
            .attr("transform", "translate(" + chartWidth / 2 + " ," + (focusChartHeight + focusChartMargin.top + 25) + ")")
            .style("text-anchor", "middle")
            .style("font-size", "18px")
            .text("Time (UTC)");

        // focus chart y label
        focus
            .append("text")
            .attr("text-anchor", "middle")
            .attr("transform", "translate(" + (-focusChartMargin.left + 20) + "," + focusChartHeight / 2 + ")rotate(-90)")
            .style("font-size", "18px")
            .text("Conversion Rate");

        function brushed() {
            if (!d3.event || !d3.event.sourceEvent || d3.event.sourceEvent.type === "zoom") return;  // ignore brush-by-zoom
            var s = d3.event.selection || xContext.range();
            xFocus.domain(s.map(xContext.invert, xContext));
            focusChartLines.selectAll(".line").attr("d", lineFocus);
            focus.select(".x-axis").call(xAxisFocus);
            svg.select(".zoom").call(zoom.transform, d3.zoomIdentity.scale(chartWidth / (s[1] - s[0])).translate(-s[0], 0));
            brushHandle
                .attr("display", null)
                .attr("transform", (d, i) => "translate(" + [s[i], -contextChartHeight - 20] + ")");
        }

        function zoomed() {
            if (!d3.event || !d3.event.sourceEvent || d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush // ignore zoom-by-brush
            var t = d3.event.transform;
            xFocus.domain(t.rescaleX(xContext).domain());
            focusChartLines.selectAll(".line").attr("d", lineFocus);
            focus.select(".x-axis").call(xAxisFocus);
            var brushSelection = xFocus.range().map(t.invertX, t);
            context.select(".brush").call(brush.move, brushSelection);
            brushHandle
                .attr("display", null)
                .attr("transform", (d, i) => "translate(" + [brushSelection[i], -contextChartHeight - 20] + ")");
        }

        return svg.node();
    }
}
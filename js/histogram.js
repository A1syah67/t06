const drawHistogram = (data) => {
    // Step 6.1 Set the dimensions and margins of the chart area
    const svg = d3.select("#histogram")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`) // scales with the container (responsive)
        .attr("preserveAspectRatio", "xMidYMid meet");

    // Create an inner chart group with margins
    innerChartH = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Step 6.2 Set up bins (binGenerator lives in shared-constants.js)
    const bins = binGenerator(data);
    console.log(bins);

    // Step 6.3 Get the lower and upper bounds of bins
    const minValue = bins[0].x0;
    const maxValue = bins[bins.length - 1].x1;
    const maxCount = d3.max(bins, d => d.length);

    // Define scales (from shared constants)
    xScale.domain([minValue, maxValue]).range([0, innerWidth]);
    yScale.domain([0, maxCount]).range([innerHeight, 0]).nice();

    // Step 6.4 Draw the bars of the histogram
    innerChartH.selectAll("rect")
        .data(bins)
        .join("rect")
        .attr("x", d => xScale(d.x0))
        .attr("y", d => yScale(d.length))
        .attr("width", d => xScale(d.x1) - xScale(d.x0))
        .attr("height", d => innerHeight - yScale(d.length))
        .attr("fill", barColor)
        .attr("stroke", bodyBackgroundColor) // creates the gap between bars
        .attr("stroke-width", 2);

    // Step 6.5 Add axes
    // Add the x-axis to the bottom of the inner chart
    innerChartH.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${innerHeight})`)
        .call(d3.axisBottom(xScale).tickFormat(d3.format(",")));

    // Add the x-axis label
    svg.append("text")
        .attr("class", "axis-label")
        .attr("x", width - margin.right)
        .attr("y", height - 8)
        .attr("text-anchor", "end")
        .text("Labeled Energy Consumption (kWh/year)");

    // Step 6.6 Add left axis
    innerChartH.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(yScale).tickFormat(d3.format(",")));

    svg.append("text")
        .attr("class", "axis-label")
        .attr("x", margin.left)
        .attr("y", margin.top - 15)
        .text("Frequency");
};

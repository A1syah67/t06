const drawScatterplot = (data) => {
    // Create the responsive SVG
    const svg = d3.select("#scatterplot")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .style("overflow", "visible"); // lets the tooltip show above the top of the chart

    // Create an inner chart group with margins
    innerChartS = svg
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
    
    // Set up x and y scales using data extents
    const xExtent = d3.extent(data, d => d.star);
    const yMax = d3.max(data, d => d.energyConsumption);

    const xScaleS = d3.scaleLinear()
        .domain([xExtent[0] - 0.5, xExtent[1] + 0.5])
        .range([0, innerWidth]);

    const yScaleS = d3.scaleLinear()
        .domain([0, yMax])
        .range([innerHeight, 0])
        .nice();

    // Set up colours for screen technologies
    const uniqueTechs = [...new Set(data.map(d => d.screenTech))];

    colorScale
        .domain(uniqueTechs)
        .range(d3.schemeCategory10);

    // Draw the circles
    innerChartS.selectAll("circle")
        .data(data)
        .join("circle")
        .attr("cx", d => xScaleS(d.star))
        .attr("cy", d => yScaleS(d.energyConsumption))
        .attr("r", 3)
        .attr("fill", d => colorScale(d.screenTech))
        .attr("opacity", 0.6);

    // Add axes
    const bottomAxis = d3.axisBottom(xScaleS);

    innerChartS.append("g")
        .attr("transform", `translate(0, ${innerHeight})`)
        .call(bottomAxis);

    svg.append("text")
        .text("Star Rating")
        .attr("text-anchor", "end")
        .attr("x", width - 20)
        .attr("y", height - 5)
        .attr("class", "axis-label");

    const leftAxis = d3.axisLeft(yScaleS);

    innerChartS.append("g")
        .call(leftAxis);

    // Rotated y-axis label
    svg.append("text")
        .text("Labeled Energy Consumption (kWh/year)")
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "middle")
        .attr("x", -(margin.top + innerHeight / 2))
        .attr("y", 18)
        .attr("class", "axis-label");

    // Add a legend on the right-hand side
    const legend = svg.append('g')
        .attr('class', 'legend')
        .attr('transform', `translate(${width - 140}, ${margin.top})`);

    uniqueTechs.forEach((tech, i) => {
        const g = legend.append('g').attr('transform', `translate(0, ${i * 22})`);
        g.append('rect')
            .attr('width', 12)
            .attr('height', 12)
            .attr('fill', colorScale(tech));
        g.append('text')
            .attr('x', 18)
            .attr('y', 10)
            .text(tech)
            .attr('class', 'axis-label');
    });

};
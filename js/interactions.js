// Build the screen-technology buttons and connect them to histogram filtering.
const populateFilters = (data) => {
    // Step 7.3 Set up buttons and event listeners
    d3.select("#filters_screen")
        .selectAll("button")
        .data(filters_screen)
        .join("button")
        .attr("class", d => d.isActive ? "filter active" : "filter")
        .attr("id", d => d.id)
        .text(d => d.label)
        .on("click", (e, d) => {
            // Only one filter is active at a time
            if (d.isActive) return;
            filters_screen.forEach(f => f.isActive = (f.id === d.id));

            // Update the look of the buttons
            d3.selectAll("#filters_screen button")
                .attr("class", f => f.isActive ? "filter active" : "filter");

            // Update the histogram with the selected filter
            updateHistogram(d.id, data);
        });
};

const updateHistogram = (filterId, data) => {
    // Step 7.4 Update the histogram
    const updatedData = filterId === "all"
        ? data
        : data.filter(d => d.screenTech === filterId);

    const updatedBins = binGenerator(updatedData);

    // Rescale the y-axis so smaller groups (e.g. OLED) stay readable
    yScale.domain([0, d3.max(updatedBins, d => d.length)]).nice();

    innerChartH.selectAll("rect")
        .data(updatedBins)
        .join("rect")
        .transition()
        .duration(750)
        .ease(d3.easeCubicInOut)
        .attr("x", d => xScale(d.x0))
        .attr("y", d => yScale(d.length))
        .attr("width", d => xScale(d.x1) - xScale(d.x0))
        .attr("height", d => innerHeight - yScale(d.length));

    innerChartH.select(".y-axis")
        .transition()
        .duration(750)
        .call(d3.axisLeft(yScale).tickFormat(d3.format(",")));
};

// T06-2 Step 3: Creating a tooltip and adding function call to load-data.js
const createTooltip = () => {
    // Step 3.2 Append (a hidden) tooltip to innerChart

    // Step 3.3 Append tooltip background rectangle

    // Step 3.4 Apped tooltip text

};

// T06-2 Step 3.5 Add functions to react to mouse events
const handleMouseEvents = () => {
    const tooltip = innerChartS.select(".tooltip");

    // Step 3.6 Select all circles in scatter plot
    // Step 3.7 Attach event listeners to mouseenter and mouseleave events
    innerChartS.selectAll("circle")
        .on("mouseenter", (e, d) => {
            tooltip.select("text")
                .text(`${d.screenSize} inches`);

            // Get the hovered circle's position
            const cx = +e.target.getAttribute("cx");
            const cy = +e.target.getAttribute("cy");

            // Centre the tooltip above the circle
            tooltip
                .interrupt()
                .attr(
                    "transform",
                    `translate(${cx - 0.5 * tooltipWidth},
                               ${cy - 1.5 * tooltipHeight})`
                )
                .transition()
                .duration(200)
                .style("opacity", 1);
        })
        .on("mouseleave", () => {
            tooltip
                .interrupt()
                .style("opacity", 0)
                .attr("transform", "translate(0, 500)");
        });
};
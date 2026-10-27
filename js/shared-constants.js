// Set up dimensions and margins
const margin = { top: 40, right: 30, bottom: 50, left: 70 };
const width = 800; // Total width of the chart
const height = 400; // Total height of the chart
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

/* Make the colours accessible globally */
/****************************************/
const barColor = "#606464";
const bodyBackgroundColor = "#fffaf0";

// Set up the scales
const xScale = d3.scaleLinear();
const yScale = d3.scaleLinear();

// T06-1 Step 6.2 Create a bin generator using d3.bin
// Bins of 200 kWh/year from 0 to 1,800 (TVs above 1,800 are left out, as noted on the page)
const binGenerator = d3.bin()
    .value(d => d.energyConsumption) // change this value to plot a different variable (e.g. d.screenSize)
    .domain([0, 1800])
    .thresholds(d3.range(200, 1800, 200));

// Inner chart group for the histogram (set in drawHistogram, reused when updating)
let innerChartH;

// T06-1 Step 7.2 Make the filter options accessible globally
const filters_screen = [
    { id: "all", label: "All", isActive: true },
    { id: "LED", label: "LED", isActive: false },
    { id: "LCD", label: "LCD", isActive: false },
    { id: "OLED", label: "OLED", isActive: false }
];

// T06-2 Step 1.4 Set up shared constant

// T06-2 Step 3.3 Add tooltipWidth and tooltipHeight
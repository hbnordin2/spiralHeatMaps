HTMLWidgets.widget({

  name: 'spiralHeatMap',

  type: 'output',

  factory: function(el, width, height) {

    // TODO: define shared variables for this instance

    return {

      renderValue: function(x) {


// Set the dimensions of the canvas / graph
var margin = {top: 30, right: 20, bottom: 30, left: 50},
    width = 600 - margin.left - margin.right,
    height = 270 - margin.top - margin.bottom;

// Parse the date / time
var parseDate = d3.time.format("%d-%b-%y").parse;

// Set the ranges
var x = d3.time.scale().range([0, width]);
var y = d3.scale.linear().range([height, 0]);

// Define the axes
var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(5);

var yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(5);

// Define the line
var valueline = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.close); });

// Adds the svg canvas
var svg = d3.select(el)
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

// Get the data
data = [
{date:"1-May-12",close:58.13},
{date:"30-Apr-12",close:53.98},
{date:"27-Apr-12",close:67.00},
{date:"26-Apr-12",close:89.70},
{date:"25-Apr-12",close:99.00},
{date:"24-Apr-12",close:130.28},
{date:"23-Apr-12",close:166.70},
{date:"20-Apr-12",close:234.98},
{date:"19-Apr-12",close:345.44},
{date:"18-Apr-12",close:443.34},
{date:"17-Apr-12",close:543.70},
{date:"16-Apr-12",close:580.13},
{date:"13-Apr-12",close:605.23},
{date:"12-Apr-12",close:622.77},
{date:"11-Apr-12",close:626.20},
{date:"10-Apr-12",close:628.44},
{date:"9-Apr-12",close:636.23},
{date:"5-Apr-12",close:633.68},
{date:"4-Apr-12",close:624.31},
{date:"3-Apr-12",close:629.32},
{date:"2-Apr-12",close:618.63},
{date:"30-Mar-12",close:599.55},
{date:"29-Mar-12",close:609.86},
{date:"28-Mar-12",close:617.62},
{date:"27-Mar-12",close:614.48},
{date:"26-Mar-12",close:606.98}
];

//d3.csv("data.csv", function(error, data) {
   data.forEach(function(d) {
        d.date = parseDate(d.date);
        d.close = +d.close;
    });

    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain([0, d3.max(data, function(d) { return d.close; })]);

    // Add the valueline path.
    svg.append("path")
        .attr("class", "line")
        .attr("d", valueline(data));

    // Add the X Axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // Add the Y Axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

//});


      },

      resize: function(width, height) {

        // TODO: code to re-render the widget with a new size

      }

    };
  }
});

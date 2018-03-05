HTMLWidgets.widget({

  name: 'spiralHeatMap',

  type: 'output',

  factory: function(el, width, height) {

    // TODO: define shared variables for this instance

    return {

      renderValue: function(x) {
var data =[{"name":"A","value":0.0817},{"name":"B","value":0.0149},{"name":"C","value":0.0278},{"name":"D","value":0.0425},{"name":"E","value":0.127},{"name":"F","value":0.0229},{"name":"G","value":0.0202},{"name":"H","value":0.0609},{"name":"I","value":0.0697},{"name":"J","value":0.0015},{"name":"K","value":0.0077},{"name":"L","value":0.0402},{"name":"M","value":0.0241},{"name":"N","value":0.0675},{"name":"O","value":0.0751},{"name":"P","value":0.0193},{"name":"Q","value":0.001},{"name":"R","value":0.0599},{"name":"S","value":0.0633},{"name":"T","value":0.0906},{"name":"U","value":0.0276},{"name":"V","value":0.0098},{"name":"W","value":0.0236},{"name":"X","value":0.0015},{"name":"Y","value":0.0197},{"name":"Z","value":0.0007}];

var width = 960,
    height = 500,
    barHeight = height / 2 - 40;

var formatNumber = d3.format("s");

var color = d3.scale.ordinal()
    .range(["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462","#b3de69","#fccde5","#d9d9d9","#bc80bd","#ccebc5","#ffed6f"]);

var svg = d3.select('body').append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width/2 + "," + height/2 + ")");

  data.sort(function(a,b) { return b.value - a.value; });

  var extent = d3.extent(data, function(d) { return d.value; });
  var barScale = d3.scale.linear()
      .domain(extent)
      .range([0, barHeight]);

  var keys = data.map(function(d,i) { return d.name; });
  var numBars = keys.length;

  var x = d3.scale.linear()
      .domain(extent)
      .range([0, -barHeight]);

  var xAxis = d3.svg.axis()
      .scale(x).orient("left")
      .ticks(3)
      .tickFormat(formatNumber);

  var circles = svg.selectAll("circle")
          .data(x.ticks(3))
        .enter().append("circle")
          .attr("r", function(d) {return barScale(d);})
          .style("fill", "none")
          .style("stroke", "black")
          .style("stroke-dasharray", "2,2")
          .style("stroke-width",".5px");

  var arc = d3.svg.arc()
      .startAngle(function(d,i) { return (i * 2 * Math.PI) / numBars; })
      .endAngle(function(d,i) { return ((i + 1) * 2 * Math.PI) / numBars; })
      .innerRadius(0);

  var segments = svg.selectAll("path")
          .data(data)
        .enter().append("path")
          .each(function(d) { d.outerRadius = 0; })
          .style("fill", function (d) { return color(d.name); })
          .attr("d", arc);

  segments.transition().ease("elastic").duration(1000).delay(function(d,i) {return (25-i)*100;})
          .attrTween("d", function(d,index) {
            var i = d3.interpolate(d.outerRadius, barScale(+d.value));
            return function(t) { d.outerRadius = i(t); return arc(d,index); };
          });

  svg.append("circle")
      .attr("r", barHeight)
      .classed("outer", true)
      .style("fill", "none")
      .style("stroke", "black")
      .style("stroke-width","1.5px");

  var lines = svg.selectAll("line")
      .data(keys)
    .enter().append("line")
      .attr("y2", -barHeight - 20)
      .style("stroke", "black")
      .style("stroke-width",".5px")
      .attr("transform", function(d, i) { return "rotate(" + (i * 360 / numBars) + ")"; });

  svg.append("g")
    .attr("class", "x axis")
    .call(xAxis);

  // Labels
  var labelRadius = barHeight * 1.025;

  var labels = svg.append("g")
      .classed("labels", true);

  labels.append("def")
        .append("path")
        .attr("id", "label-path")
        .attr("d", "m0 " + -labelRadius + " a" + labelRadius + " " + labelRadius + " 0 1,1 -0.01 0");

  labels.selectAll("text")
        .data(keys)
      .enter().append("text")
        .style("text-anchor", "middle")
        .style("font-weight","bold")
        .style("fill", function(d, i) {return "#3e3e3e";})
        .append("textPath")
        .attr("xlink:href", "#label-path")
        .attr("startOffset", function(d, i) {return i * 100 / numBars + 50 / numBars + '%';})
        .text(function(d) {return d.toUpperCase(); });
      },

      resize: function(width, height) {

        // TODO: code to re-render the widget with a new size

      }

    };
  }
});

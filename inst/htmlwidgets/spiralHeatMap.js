HTMLWidgets.widget({

  name: 'spiralHeatMap',

  type: 'output',

  factory: function(el, width, height) {

    // TODO: define shared variables for this instance

    return {

      renderValue: function(x) {
        const radians = 0.0174532925;

        //CHART CONSTANTS
        const chartRadius = 250;
        const chartWidth = chartRadius * 2;
        const chartHeight = chartRadius * 2;
      	const labelRadius = chartRadius + 5;
        const margin = { "top": 40, "bottom": 40, "left": 40, "right": 40 };
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        //CHART OPTIONS
        const holeRadiusProportion = 0.3; //fraction of chartRadius. 0 gives you some pointy arcs in the centre.
        const holeRadius = holeRadiusProportion * chartRadius;
        const segmentsPerCoil = 12; //number of coils. for this example, I have 12 months per year. But you change to whatever suits your data.
        const segmentAngle = 360 / segmentsPerCoil;
        var coils; //number of coils, based on data.length / segmentsPerCoil
        var coilWidth; //remaining chartRadius (after holeRadius removed), divided by coils + 1. I add 1 as the end of the coil moves out by 1 each time

        //SCALES
        var colour = d3.scaleSequential(d3.interpolateViridis);

        //CREATE SVG AND A G PLACED IN THE CENTRE OF THE SVG
        const svg = d3.select(el)
            .append("svg")
            .attr("width", chartWidth + margin.left + margin.right)
            .attr("height", chartHeight + margin.top + margin.bottom);

        const g = svg.append("g")
            .attr("transform", "translate("
            + (margin.left + chartRadius)
            + ","
            + (margin.top + chartRadius) + ")");

          	//ENSURE THE DATA IS SORTED CORRECTLY, IN THIS CASE BY YEAR AND MONTH
          	//THE SPIRAL WILL START IN THE MIDDLE AND WORK OUTWARDS
          	data.sort(function (a, b) {
            	return a.year - b.year || a.month - b.month;
            });

          	//CALCULATE AND STORE THE REMAING
          	var dataLength = data.length;
            coils = Math.ceil(dataLength / segmentsPerCoil);
            coilWidth = (chartRadius * (1 - holeRadiusProportion)) / (coils + 1);
            //console.log("coilWidth: " + coilWidth);
            var dataExtent = d3.extent(data, function (d) { return d.value; });
            colour.domain(dataExtent);

          	//ADD LABELS AND GRIDS FOR EACH MONTH FIRST
          	//SO THE GRID LINES APPEAR BEHIND THE SPIRAL
            var monthLabels = g.selectAll(".month-label")
                .data(months)
                .enter()
                .append("g")
                .attr("class", "month-label");

            monthLabels.append("text")
                .text(function (d) { return d; })
                .attr("x", function (d, i) {
                    let labelAngle = (i * segmentAngle) + (segmentAngle / 2);
                    return x(labelAngle, labelRadius);
                })
                .attr("y", function (d, i) {
                    let labelAngle = (i * segmentAngle) + (segmentAngle / 2);
                    return y(labelAngle, labelRadius);
                })
                .style("text-anchor", function (d, i) {
                    return i < (months.length / 2) ? "start" : "end";
                });

            monthLabels.append("line")
                .attr("x2", function (d, i) {
                    let lineAngle = (i * segmentAngle);
                    let lineRadius = chartRadius + 10;
                    return x(lineAngle, lineRadius);
                })
                .attr("y2", function (d, i) {
                    let lineAngle = (i * segmentAngle);
                    let lineRadius = chartRadius + 10;
                    return y(lineAngle, lineRadius);
                });


            //ASSUMING DATA IS SORTED, CALCULATE EACH DATA POINT'S SEGMENT VERTICES
            data.forEach(function (d, i) {

                let coil = Math.floor(i / segmentsPerCoil);
                let position = i - (coil * segmentsPerCoil);

                //console.log("positions: " + i + " " + coil + " " + position);

                let startAngle = position * segmentAngle;
                let endAngle = (position + 1) * segmentAngle;

                //console.log("angles: " + startAngle + " " + endAngle);
                //console.log(holeRadius + " " + segmentsPerCoil + " " + coilWidth)

                let startInnerRadius = holeRadius + ((i / segmentsPerCoil) * coilWidth)
                let startOuterRadius = holeRadius + ((i / segmentsPerCoil) * coilWidth) + coilWidth;
                let endInnerRadius = holeRadius + (((i + 1) / segmentsPerCoil) * coilWidth)
                let endOuterRadius = holeRadius + (((i + 1) / segmentsPerCoil) * coilWidth) + coilWidth;

                //console.log("start radi: " + startInnerRadius + " " + startOuterRadius);
                //console.log("end radi: " + endInnerRadius + " " + endOuterRadius);

                //vertices of each segment
                d.x1 = x(startAngle, startInnerRadius);
                d.y1 = y(startAngle, startInnerRadius);

                d.x2 = x(endAngle, endInnerRadius);
                d.y2 = y(endAngle, endInnerRadius);

                d.x3 = x(endAngle, endOuterRadius);
                d.y3 = y(endAngle, endOuterRadius);

                d.x4 = x(startAngle, startOuterRadius);
                d.y4 = y(startAngle, startOuterRadius);

                //CURVE CONTROL POINTS
                let midAngle = startAngle + (segmentAngle / 2)
                let midInnerRadius = holeRadius + (((i + 0.5) / segmentsPerCoil) * coilWidth)
                let midOuterRadius = holeRadius + (((i + 0.5) / segmentsPerCoil) * coilWidth) + coilWidth;

                //MID POINTS, WHERE THE CURVE WILL PASS THRU
                d.mid1x = x(midAngle, midInnerRadius);
                d.mid1y = y(midAngle, midInnerRadius);

                d.mid2x = x(midAngle, midOuterRadius);
                d.mid2y = y(midAngle, midOuterRadius);

                //FROM https://stackoverflow.com/questions/5634460/quadratic-b%C3%A9zier-curve-calculate-points
                d.controlPoint1x = (d.mid1x - (0.25 * d.x1) - (0.25 * d.x2)) / 0.5;
                d.controlPoint1y = (d.mid1y - (0.25 * d.y1) - (0.25 * d.y2)) / 0.5;

                d.controlPoint2x = (d.mid2x - (0.25 * d.x3) - (0.25 * d.x4)) / 0.5;
                d.controlPoint2y = (d.mid2y - (0.25 * d.y3) - (0.25 * d.y4)) / 0.5;

                //console.log(d);

            });

            var arcs = g.selectAll(".arc")
                .data(data)
                .enter()
                .append("g")
                .attr("class", "arc");

            //STRAIGHT EDGES
            /*
            arcs.append("path")
                .attr("d", function (d) {
                    let M = "M " + d.x1 + " " + d.y1;
                    let L1 = "L " + d.x2 + " " + d.y2;
                    let L2 = "L " + d.x3 + " " + d.y3;
                    let L3 = "L " + d.x4 + " " + d.y4;
                    return M + " " + L1 + " " + L2 + " " + L3 + " Z"
                })
                //.style("fill", function (d) { return colour(d.value); })
                .style("fill", "white")
                .style("stroke", "white")
            */

            //CURVED EDGES
            arcs.append("path")
                .attr("d", function (d) {
                    //start at vertice 1
                    let start = "M " + d.x1 + " " + d.y1;
                    //inner curve to vertice 2
                    let side1 = " Q " + d.controlPoint1x + " " + d.controlPoint1y + " " + d.x2 + " " + d.y2;
                    //straight line to vertice 3
                    let side2 = "L " + d.x3 + " " + d.y3;
                    //outer curve vertice 4
                    let side3 = " Q " + d.controlPoint2x + " " + d.controlPoint2y + " " + d.x4 + " " + d.y4;
                    //combine into string, with closure (Z) to vertice 1
                    return start + " " + side1 + " " + side2 + " " + side3 + " Z"
                })
                .style("fill", function (d) { return colour(d.value); })
                .style("stroke", "white")

						//ADD LABELS FOR THE YEAR AT THE START OF EACH COIL (IE THE FIRST MONTH)
            var yearLabels = arcs.filter(function (d) { return d.month == 1; }).raise();

            yearLabels.append("path")
                .attr("id", function (d) { return "path-" + d.year; })
                .attr("d", function (d) {
                    //start at vertice 1
                    let start = "M " + d.x1 + " " + d.y1;
                    //inner curve to vertice 2
                    let side1 = " Q " + d.controlPoint1x + " " + d.controlPoint1y + " " + d.x2 + " " + d.y2;
                    return start + side1;
                })
                .style("fill", "none")
            //.style("opacity", 0);

            yearLabels.append("text")
                .attr("class", "year-label")
                .attr("x", 3)
                .attr("dy", -5)
                .append("textPath")
                .attr("xlink:href", function (d) {
                    return "#path-" + d.year;
                })
                .text(function (d) { return d.year; })

            //DRAW LEGEND

            const legendWidth = chartRadius;
            const legendHeight = 20;
            const legendPadding = 40;

            var legendSVG = d3.select("#legend")
                .append("svg")
                .attr("width", legendWidth + legendPadding + legendPadding)
                .attr("height", legendHeight + legendPadding + legendPadding);

            var defs = legendSVG.append("defs");

            var legendGradient = defs.append("linearGradient")
                .attr("id", "linear-gradient")
                .attr("x1", "0%")
                .attr("y1", "0%")
                .attr("x2", "100%")
                .attr("y2", "0%");

            let noOfSamples = 20;
            let dataRange = dataExtent[1] - dataExtent[0];
            let stepSize = dataRange / noOfSamples;

            for (i = 0; i < noOfSamples; i++) {
                legendGradient.append("stop")
                    .attr("offset", (i / (noOfSamples - 1)))
                    .attr("stop-color", colour(dataExtent[0] + (i * stepSize)));
            }

            var legendG = legendSVG.append("g")
                .attr("class", "legendLinear")
                .attr("transform", "translate(" + legendPadding + "," + legendPadding + ")");

            legendG.append("rect")
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", legendWidth)
                .attr("height", legendHeight)
                .style("fill", "url(#linear-gradient)");

            legendG.append("text")
                .text("Fewer nights")
                .attr("x", 0)
                .attr("y", legendHeight - 35)
                .style("font-size", "12px");

            legendG.append("text")
                .text("More nights")
                .attr("x", legendWidth)
                .attr("y", legendHeight - 35)
                .style("text-anchor", "end")
                .style("font-size", "12px");

        function x(angle, radius) {
            //change to clockwise
            let a = 360 - angle;
            //start from 12 o'clock
            a = a + 180;
            return radius * Math.sin(a * radians);
        };

        function y(angle, radius) {
            //change to clockwise
            let a = 360 - angle;
            //start from 12 o'clock
            a = a + 180;
            return radius * Math.cos(a * radians);
        };

        function convertTextToNumbers(d) {
            d.year = +d.year;
            d.month = +d.month;
            d.value = +d.value;
            return d;
        };
      },

      resize: function(width, height) {

        // TODO: code to re-render the widget with a new size

      }

    };
  }
});

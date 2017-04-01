$( document ).ready(function () {

    $(document).on("click", ":submit", function(event){
        if ( $(this).val() == "load" ) {
            loadData($("select#datasetSelector").val());
        } else if ( $(this).val() == "generate" ) {

        } else {

        }
        event.preventDefault();
    });

    function plotData() {
        $( ".reuse").empty();

        var margin = {top: 20, right: 20, bottom: 50, left: 50},
            width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        var x = d3.scaleLinear().range([0, width]);
        var y = d3.scaleLinear().range([height, 0]);

        var div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        var svg = d3.select("#visualization").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform",
                  "translate(" + margin.left + "," + margin.top + ")");
        d3.csv("data/d3-workflowB/" + datafilename, function(error, data) {
            if (error) throw error;

            var table = d3.select("#table")
                .append("table")
                .classed("floatcenter", true);
            var thead = table.append("thead");
            var tbody = table.append("tbody");
            var xaxisSelector = d3.select("#xaxisSelector");
            var yaxisSelector = d3.select("#yaxisSelector");
            var newRow = thead.append("tr");

            var headerNames = d3.keys(data[0]);
            for (var k in headerNames) {
                var newth = newRow.append("th")
                            .classed("test", true);
                        newth.append("div").text(headerNames[k]);
                if (isNaN(data[1][headerNames[k]])) {

                } else {
                    xaxisSelector.append("option")
                        .attr("value", headerNames[k])
                        .text(headerNames[k]);
                    yaxisSelector.append("option")
                        .attr("value", headerNames[k])
                        .text(headerNames[k]);
                }
            }
            data.forEach(function(d) {
                var newRow = tbody.append("tr");
                for (var key in d) {
                    if (d.hasOwnProperty(key)) {
                        var newtd = newRow.append("td")
                            .classed("test", true);
                        newtd.append("div").text(d[key]);
                    }
                }
            });
            if (loadtype == "plot") {
              // scale the range of the data
              x.domain([0, d3.max(data, function(d) { return d[xaxis]; })*1.33]);
              y.domain([0, d3.max(data, function(d) { return d[yaxis]; })*1.33]);

              // add the dots with tooltips
              svg.selectAll("dot")
                 .data(data)
               .enter().append("circle")
                 .attr("r", 5)
                 .attr("cx", function(d) { return x(d[xaxis]); })
                 .attr("cy", function(d) { return y(d[yaxis]); })
                 .on("mouseover", function(d) {
                   div.transition()
                     .duration(200)
                     .style("opacity", .9);
                   div.html("<div>" + xaxis + ":  " + d[xaxis] + "</div><div>" +  yaxis+ ":  " +d[yaxis] + "</div>")
                     .style("left", (d3.event.pageX) + "px")
                     .style("top", (d3.event.pageY - 28) + "px");
                   })
                 .on("mouseout", function(d) {
                   div.transition()
                     .duration(500)
                     .style("opacity", 0);
                   });

              svg.append("text")
                .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
                .attr("transform", "translate("+ (width/2) +","+(height+margin.bottom-15)+")")  // centre below axis
                .text(xaxis);
              svg.append("text")
                .attr("text-anchor", "middle")
                .attr("transform", "translate("+ (-margin.left+15) +","+(height/2)+")rotate(-90)")
                .text(yaxis);
            } else {
              svg.append("text")
                .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
                .attr("transform", "translate("+ (width/2) +","+(height+margin.bottom-15)+")")  // centre below axis
                .text("x-axis");
              svg.append("text")
                .attr("text-anchor", "middle")
                .attr("transform", "translate("+ (-margin.left+15) +","+(height/2)+")rotate(-90)")
                .text("y-axis");
              }
              // xaxis
              svg.append("g")
                  .attr("transform", "translate(0," + height + ")")
                  .call(d3.axisBottom(x));
              //yaxis
              svg.append("g")
                  .call(d3.axisLeft(y));
        });
    }

    function loadData(datafilename) {
        d3.csv("data/d3-workflowB/" + datafilename, function(error, data) {
            if (error) throw error;

            var xaxisSelector = d3.select("#xaxisSelector");
            var yaxisSelector = d3.select("#yaxisSelector");
            var colorSelector = d3.select("#coloraxisSelector");

            var headerNames = d3.keys(data[0]);
            for (var k in headerNames) {
                colorSelector.append("option")
                        .attr("value", headerNames[k])
                        .text(headerNames[k]);
                if (isNaN(data[1][headerNames[k]])) {

                } else {
                    xaxisSelector.append("option")
                        .attr("value", headerNames[k])
                        .text(headerNames[k]);
                    yaxisSelector.append("option")
                        .attr("value", headerNames[k])
                        .text(headerNames[k]);
                }
            }
        });
    }
});

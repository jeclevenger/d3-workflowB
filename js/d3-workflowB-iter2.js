$( document ).ready(function () {
    var colorScales = [
        "Viridis",
        "Inferno",
        "Magma",
        "Plasma",
        "Warm",
        "Cool",
        "Rainbow",
        "CubehelixDefault",
        "schemeAccent",
        "schemeDark2",
        "schemePastel2",
        "schemeSet2",
        "schemeSet1",
        "schemePastel1",
        "schemeCategory10",
        "schemeSet3",
        "schemePaired",
        "schemeCategory20",
        "schemeCategory20b",
        "schemeCategory20c",
        "Blues",
        "Greens",
        "Greys",
        "Oranges",
        "Purples",
        "Reds",
        "BuGn",
        "BuPu",
        "GnBu",
        "OrRd",
        "PuBuGn",
        "PuBu",
        "PuRd",
        "RdPu",
        "YlGnBu",
        "YlGn",
        "YlOrBr",
        "YlOrRd"
    ];
    for (var i in colorScales) {
        var tempScale = d3.select("select#colorscaleSelector").append("option")
                            .attr("value", colorScales[i])
                            .text(colorScales[i]);
        if (colorScales[i].includes("scheme")) {
            tempScale
                .attr("dtype", "discrete");
        } else {
            tempScale
                .attr("dtype", "continuous");
        }
    }


    $(document).on("click", ":submit", function(event){
        if ( $(this).val() == "load" ) {
            loadData($("select#datasetSelector").val());
            $("#currentdataset").text($("select#datasetSelector").val());
        } else if ( $(this).val() == "generate" ) {
            plotData($("select#datasetSelector").val(),
                $("select#xaxisSelector").val(),
                $("#xaxismin").val(),
                $("#xaxismax").val(),
                $("select#yaxisSelector").val(),
                $("#yaxismin").val(),
                $("#yaxismax").val(),
                $("select#coloraxisSelector").val(),
                $("select#colorscaleSelector").val(),
                $("#colormapType").text(),
                $("#coloraxismin").val(),
                $("#coloraxismax").val());
            $("#currentdataset").text($("select#datasetSelector").val());
        } else {

        }
        event.preventDefault();
    });
    //todo condense
    $("#xaxisSelector").change(function() {
        $("#xaxisminRange").text("( " + $(this).find(":selected").attr("rangemin") + " )");
        $("#xaxismin").val($(this).find(":selected").attr("rangemin"));
        $("#xaxismaxRange").text("( " + $(this).find(":selected").attr("rangemax") + " )");
        $("#xaxismax").val($(this).find(":selected").attr("rangemax"));
    });
    $("#yaxisSelector").change(function() {
        $("#yaxisminRange").text("( " + $(this).find(":selected").attr("rangemin") + " )");
        $("#yaxismin").val($(this).find(":selected").attr("rangemin"));
        $("#yaxismaxRange").text("( " + $(this).find(":selected").attr("rangemax") + " )");
        $("#yaxismax").val($(this).find(":selected").attr("rangemax"))
    });
    $("#coloraxisSelector").change(function() {
        $("#colormapType").text($(this).find(":selected").attr("dtype"));
        $("#colorscaleSelector").val("none");
        if ($(this).find(":selected").attr("dtype") == "discrete") {
            $("#colorscaleSelector option[dtype=continuous]").attr('disabled','disabled');
            $("#coloraxismin").attr('disabled','disabled');
            $("#coloraxismax").attr('disabled','disabled');
            $("#colorscaleSelector option[dtype=discrete]").removeAttr('disabled');
        } else if ($(this).find(":selected").attr("dtype") == "continuous") {
            $("#colorscaleSelector option[dtype=discrete]").attr('disabled','disabled');
            $("#colorscaleSelector option[dtype=continuous]").removeAttr('disabled');
            $("#coloraxismin").removeAttr('disabled');
            $("#coloraxismax").removeAttr('disabled');
        } else {

        }
        $("#coloraxisminRange").text("( " + $(this).find(":selected").attr("rangemin") + " )");
        $("#coloraxismin").val($(this).find(":selected").attr("rangemin"));
        $("#coloraxismaxRange").text("( " + $(this).find(":selected").attr("rangemax") + " )");
        $("#coloraxismax").val($(this).find(":selected").attr("rangemax"))

    });

    function loadData(datafilename) {
        d3.csv("data/d3-workflowB/" + datafilename, function(error, data) {
            $( ".reuseSelector").empty();
            d3.selectAll(".reuseSelector").append("option")
                .attr("value", "none");

            if (error) throw error;

            var xaxisSelector = d3.select("#xaxisSelector");
            var yaxisSelector = d3.select("#yaxisSelector");
            var colorSelector = d3.select("#coloraxisSelector");

            var headerNames = d3.keys(data[0]);
            for (var k in headerNames) {
                var rangemax = d3.max(data, function(d) { return parseFloat(d[headerNames[k]]); });
                var rangemin = d3.min(data, function(d) { return parseFloat(d[headerNames[k]]); });

                if (isNaN(data[1][headerNames[k]])) {
                    colorSelector.append("option")
                        .attr("value", headerNames[k])
                        .attr("dtype", "discrete")
                        .text(headerNames[k]);
                } else {
                    colorSelector.append("option")
                        .attr("value", headerNames[k])
                        .attr("rangemax", rangemax)
                        .attr("rangemin", rangemin)
                        .attr("dtype", "continuous")
                        .text(headerNames[k]);
                    xaxisSelector.append("option")
                        .attr("value", headerNames[k])
                        .attr("rangemax", rangemax)
                        .attr("rangemin", rangemin)
                        .text(headerNames[k]);
                    yaxisSelector.append("option")
                        .attr("value", headerNames[k])
                        .attr("rangemax", rangemax)
                        .attr("rangemin", rangemin)
                        .text(headerNames[k]);
                }
            }
        });
    }


    function plotData(datafilename,xaxis,xmin,xmax,yaxis,ymin,ymax,coloraxis,colorscale,colorscaletype,colormin,colormax) {
        $( ".reuse").empty();

        var margin = {top: 20, right: 20, bottom: 50, left: 50},
            width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        var x = d3.scaleLinear()
                    .range([0, width])
                    .domain([xmin, xmax]);
        var y = d3.scaleLinear()
                    .range([height, 0])
                    .domain([ymin, ymax]);

        if (colorscaletype == "discrete") {
            var color = d3.scaleOrdinal(d3[colorscale]);
        } else if (colorscaletype == "continuous") {
            var color = d3.scaleSequential(d3["interpolate"+colorscale])
                .domain([colormin,colormax]);
        } else {
            alert("unknown color scale type")
        }
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

            /* todo
            http://stackoverflow.com/questions/25412046/d3js-working-with-unknown-headers-number-of-columns-number-of-rows
             */
            for (var k in headerNames) {
                var newth = newRow.append("th")
                            .classed("test", true);
                        newth.append("div").text(headerNames[k]);
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
            svg.selectAll("dot")
             .data(data)
            .enter().append("circle")
             .attr("r", 5)
             .attr("cx", function(d) { return x(d[xaxis]); })
             .attr("cy", function(d) { return y(d[yaxis]); })
             .attr("fill", function(d) { return color(d[coloraxis]); })
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
            .attr("text-anchor", "middle")
            .attr("transform", "translate("+ (width/2) +","+(height+margin.bottom-15)+")")
            .text(xaxis);
            svg.append("text")
            .attr("text-anchor", "middle")
            .attr("transform", "translate("+ (-margin.left+15) +","+(height/2)+")rotate(-90)")
            .text(yaxis);

            svg.append("g")
              .attr("transform", "translate(0," + height + ")")
              .call(d3.axisBottom(x));
            svg.append("g")
              .call(d3.axisLeft(y));
        });
    }
});

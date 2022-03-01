
var width = 960;
var height = 500;

var projection = d3.geo.albersUsa()
    .translate([width / 2, height / 2])
    .scale([1000]);

var path = d3.geo.path()
    .projection(projection);


var svg = d3.select("#viz")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

var div = d3.select("#viz")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

d3.json("us-states.json", function (json) {
    console.log(json.features)

    svg.selectAll("path")
        .data(json.features)
        .enter()
        .append("path")
        .attr("d", path)
        .style("stroke", "#fff")
        .style("stroke-width", "1")
        .style("fill", "#e9e8ea")

    d3.csv("trains.csv", function (data) {

        svg.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", function (d) {
                return projection([d.lon, d.lat])[0];
            })
            .attr("cy", function (d) {
                return projection([d.lon, d.lat])[1];
            })
            .attr("r", function (d) {
                return Math.sqrt(d.length) * 4;
            })
            .style("fill", "#de5826")
            .style("opacity", 0.5)
            .on("mouseover", function (d, i) {
                d3.select(this)
                    .style("stroke", "#990000")
                    .style("stroke-width", "10px")
                    .style("opacity", .9)
                div.transition()
                    .duration(200)
                    .style("opacity", .9);
                div.text("The train system in " + d.city + ", locally called the " + d.locally_called + ", is " + d.length + " kilometers long, and was founded on " + d.date_started + ".")
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function (d) {
                d3.select(this)
                    .style("stroke", "none")
                    .style("opacity", .4)
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
            });
    });

});

// Thank you for the following D3 resources: 
// US States Map: https://bl.ocks.org/dnprock/5215cc464cfb9affd283
// US states map: https://gist.github.com/michellechandra/0b2ce4923dc9b5809922
// D3 tooltip: http://www.d3noob.org/2013/01/adding-tooltips-to-d3js-graph.html
// Map projection and translate: https://makeshiftinsights.com/blog/basic-maps-with-d3/
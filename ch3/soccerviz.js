function createSoccerViz() {
    d3.csv("worldcup.csv", data => {
        overallTeamViz(data)
    })


function overallTeamViz(incomingData) {
    d3.select("svg")
    .append("g")
    .attr("id", "teamsG")
    .attr("transform", "translate(50,300)")
    .selectAll("g")
    .data(incomingData)
    .enter()
    .append("g")
    .attr("class", "overallG")
    .attr("transform", (d, i) => "translate(" + (i * 50) + ", 0)")

    var teamG = d3.selectAll("g.overallG");

     teamG
    .append("circle").attr("r", 0)
    .transition()
    .delay((d, i) => i * 100)
    .duration(500)
    .attr("r", 40)
    .transition()
    .duration(500)  
    .attr("r", 20)

    teamG
    .append("text")
    .attr("y", 30)
    .text(d => d.team)  
    
    const dataKeys = Object.keys(incomingData[0])
    .filter(d => d !== "team" && d !== "region")

    d3.select("#controls").selectAll("button.teams")
    .data(dataKeys).enter()
    .append("button")
    .on("click", buttonClick)
    .html(d => d);
    
    d3.selectAll("g.overallG").insert("image", "text")
    .attr("xlink:href", d => `images/${d.team}.png`)
    .attr("width", "45px").attr("height", "20px")
    .attr("x", -22).attr("y", -10)

    d3.text("resources/infobox.html", html => {
        d3.select("body").append("div").attr("id", "infobox").html(html)
    })

    teamG.on("click", teamClick)

    function teamClick(d) {
        d3.selectAll('td.data').data(d3.values(d))
        .html(p => p)
    }

    // p 83
    // function buttonClick(datapoint) {
    //     var maxValue = d3.max(incomingData, d => parseFloat(d[datapoint]))
    //     var radiusScale = d3.scaleLinear()
    //     .domain([0, maxValue]).range([ 2, 20 ])
    //     d3.selectAll("g.overallG").select("circle").transition().duration(1000)
    //     .attr("r", d => radiusScale(d[datapoint]))
    //     d3.selectAll("g.overallG").select("text")
    //     .attr("y", 50)
    //     .text(d => d[datapoint])
    // }


    // // pg 94
    // function buttonClick(datapoint) {
    //     var maxValue = d3.max(incomingData, function(el) {
    //         return parseFloat(el[datapoint])
    //     })
    //     var tenColorScale = d3.scaleOrdinal()
    //     .domain(["UEFA", "CONMEBOL", "CAF"])
    //     .range(d3.schemeCategory10)
    //     .unknown("#c4b9ac")
    //     var radiusScale = d3.scaleLinear().domain([0, maxValue]).range([2,20])
    //     d3.selectAll("g.overallG").select("circle").transition().duration(1000)
    //         .style("fill", p => tenColorScale(p.region))
    //         .attr("r", d => radiusScale(d[datapoint]))
    // }

      // pg 96
      function buttonClick(datapoint) {
        var maxValue = d3.max(incomingData, d => parseFloat(d[datapoint]));
        var colorQuantize = d3.scaleQuantize()
        .domain([0, maxValue]).range(colorbrewer.Reds[5]);
        var radiusScale = d3.scaleLinear()
        .domain([0, maxValue]).range([2,20]);
        d3.selectAll("g.overallG").select("circle").transition().duration(1000)
            .style("fill", d => colorQuantize(d[datapoint]))
            .attr("r", d => radiusScale(d[datapoint]))
    }

    teamG.on("mouseover", highlightRegion);

    var teamColor = d3.rgb("#75739F")

    function highlightRegion(d,i) {
    d3.select(this).select("text").classed("active", true).attr("y", 10)
    d3.selectAll("g.overallG").select("circle")
        .style("fill", p => p.region === d.region ? teamColor.darker(.75) : teamColor.brighter(.5) )  
    // d3.selectAll("g.overallG").select("circle").each(function(p) {
    //     p.region == d.region ?
    //         d3.select(this).classed("active", true) :
    //         d3.select(this).classed("inactive", true)
    // })
    this.parentElement.appendChild(this)
    // .attr("class", p => p.region === d.region ? "active" : "inactive")
    }

    teamG.on("mouseout", unHighlight) 
        function unHighlight() {
        // var teamColor = d3.rgb("#75739F")
        d3.selectAll("g.overallG").select("circle").style("fill", teamColor)
        d3.selectAll("g.overallG").select("text")
        .classed("active", false).attr("y", 30)
    }

    teamG.select('text').style("pointer-events", "none");

   }
}

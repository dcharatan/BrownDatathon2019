/**
 * Constructor for the Year Chart
 * @param electionWinners inastance of electionWinners
 * @param tileChart instance of TileChart
 * @param electionInfo instance of ElectionInfo
 */
function YearChart(stateMap, electionWinners) {
    var self = this;

    self.stateMap = stateMap;

    self.electionWinners = electionWinners;
    self.init();
};

/**
 * Initializes the svg elements required for this chart
 */
YearChart.prototype.init = function () {

    var self = this;
    self.margin = { top: 10, right: 20, bottom: 30, left: 50 };
    var divyearChart = d3.select("#year-chart").classed("fullView", true);

    //Gets access to the div element created for this chart from HTML
    self.svgBounds = divyearChart.node().getBoundingClientRect();
    self.svgWidth = self.svgBounds.width - self.margin.left - self.margin.right;
    self.svgHeight = 100;

    //creates svg element wizthin the div
    self.svg = divyearChart.append("svg")
        .attr("width", self.svgWidth)
        .attr("height", self.svgHeight)

};

/**
 * Returns the class that needs to be assigned to an element
 *
 * @param party an ID for the party that is being referred to.
 */
YearChart.prototype.chooseClass = function (party) {
    var self = this;
    if (party == "R") {
        return "yearChart republican";
    }
    else if (party == "D") {
        return "yearChart democrat";
    }
    else if (party == "I") {
        return "yearChart independent";
    }
}


/**
 * Creates a chart with circles representing each election year, populates text content and other required elements for the Year Chart
 */
YearChart.prototype.update = function () {
    var self = this;

    var data = self.electionWinners;

    //Domain definition for global color scale
    var domain = [-60, -50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50, 60];

    //Color range for global color scale
    var range = ["#0066CC", "#0080FF", "#3399FF", "#66B2FF", "#99ccff", "#CCE5FF", "#ffcccc", "#ff9999", "#ff6666", "#ff3333", "#FF0000", "#CC0000"];

    //Global colorScale to be used consistently by all the charts
    self.colorScale = d3.scaleQuantile()
        .domain(domain).range(range);

    var lineDraw = self.svg
        .append("line")
        .attr("x1", 40)
        .attr("y1", 40)
        .attr("x2", 1000)
        .attr("y2", 40)
        .attr("class", "lineChart");

    var prevHighlight = 0;

    var svg = self.svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("id", function (d, i) {
            return "circ" + i;
        })
        .attr("class", function (d, i) {
            return self.chooseClass(self.electionWinners[i].PARTY);
        })
        .on("click", function (d, i) {

            d3.select(this)
                .attr("class", function () {
                    return self.chooseClass(self.electionWinners[i].PARTY) + " highlighted";
                })


            var beep = String("circ"+prevHighlight);
            var oldCircle = self.svg.select("circle[id=" + beep + "]");
    
            oldCircle
                .attr("class", function () {
                    return null;
                })
                .attr("class", function () {
                    return self.chooseClass(self.electionWinners[prevHighlight].PARTY);
                })
        
            prevHighlight = i;

            // calling update functions of js files
            self.stateMap.update(d.YEAR, self.colorScale);
        })
        .attr("cx", function (d, i) {
            return (i * 50 + 50);
        })
        .attr("cy", function (d) {
            return 40;
        })
        .attr("r", "9px")


    var dateText = self.svg.selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .attr("x", function (d, i) {
            return (i * 50 + 50);
        })
        .attr("y", "30px")
        .attr("class", "yeartext")
        .text(function (d) {
            return d.YEAR;
        });

};

/**
 * Constructor for the TileChart
 */
function TileChart() {

    var self = this;
    self.init();
};

/**
 * Initializes the svg elements required to lay the tiles
 * and to populate the legend.
 */
TileChart.prototype.init = function () {
    var self = this;

    //Gets access to the div element created for this chart and legend element from HTML
    var divTileChart = d3.select("#tiles").classed("content", true);
    var legend = d3.select("#legend").classed("content", true);
    self.margin = { top: 30, right: 20, bottom: 30, left: 50 };

    var svgBounds = divTileChart.node().getBoundingClientRect();
    self.svgWidth = svgBounds.width - self.margin.left - self.margin.right;
    self.svgHeight = self.svgWidth / 2;
    var legendHeight = 150;

    //creates svg elements within the div
    self.legendSvg = legend.append("svg")
        .attr("width", self.svgWidth)
        .attr("height", legendHeight)
        .attr("transform", "translate(" + self.margin.left + ",0)")

    self.svg = divTileChart.append("svg")
        .attr("width", self.svgWidth)
        .attr("height", self.svgHeight)
        .attr("transform", "translate(" + self.margin.left + ",0)")
        .style("bgcolor", "green")

    // Dataset of locations
    mapLocations = [
        { "state": "AK", "row": 0, "column": 0 },
        { "state": "WA", "row": 80, "column": 50 },
        { "state": "OR", "row": 120, "column": 50 },
        { "state": "CA", "row": 160, "column": 50 },
        { "state": "HI", "row": 280, "column": 50 },
        { "state": "ID", "row": 80, "column": 100 },
        { "state": "NV", "row": 120, "column": 100 },
        { "state": "UT", "row": 160, "column": 100 },
        { "state": "AZ", "row": 200, "column": 100 },
        { "state": "MT", "row": 80, "column": 150 },
        { "state": "WY", "row": 120, "column": 150 },
        { "state": "CO", "row": 160, "column": 150 },
        { "state": "NM", "row": 200, "column": 150 },
        { "state": "ND", "row": 80, "column": 200 },
        { "state": "SD", "row": 120, "column": 200 },
        { "state": "NE", "row": 160, "column": 200 },
        { "state": "KS", "row": 200, "column": 200 },
        { "state": "OK", "row": 240, "column": 200 },
        { "state": "TX", "row": 280, "column": 200 },
        { "state": "MN", "row": 80, "column": 250 },
        { "state": "IA", "row": 120, "column": 250 },
        { "state": "MO", "row": 160, "column": 250 },
        { "state": "AR", "row": 200, "column": 250 },
        { "state": "LA", "row": 240, "column": 250 },
        { "state": "IL", "row": 80, "column": 300 },
        { "state": "IN", "row": 120, "column": 300 },
        { "state": "KY", "row": 160, "column": 300 },
        { "state": "TN", "row": 200, "column": 300 },
        { "state": "MS", "row": 240, "column": 300 },
        { "state": "WI", "row": 80, "column": 350 },
        { "state": "OH", "row": 120, "column": 350 },
        { "state": "WV", "row": 160, "column": 350 },
        { "state": "NC", "row": 200, "column": 350 },
        { "state": "AL", "row": 240, "column": 350 },
        { "state": "MI", "row": 80, "column": 400 },
        { "state": "PA", "row": 120, "column": 400 },
        { "state": "VA", "row": 160, "column": 400 },
        { "state": "SC", "row": 200, "column": 400 },
        { "state": "GA", "row": 240, "column": 400 },
        { "state": "NY", "row": 80, "column": 450 },
        { "state": "NJ", "row": 120, "column": 450 },
        { "state": "MD", "row": 160, "column": 450 },
        { "state": "DE", "row": 200, "column": 450 },
        { "state": "FL", "row": 280, "column": 450 },
        { "state": "VT", "row": 40, "column": 500 },
        { "state": "RI", "row": 80, "column": 500 },
        { "state": "CT", "row": 120, "column": 500 },
        { "state": "DC", "row": 160, "column": 500 },
        { "state": "ME", "row": 0, "column": 550 },
        { "state": "NH", "row": 40, "column": 550 },
        { "state": "MA", "row": 80, "column": 550 },
    ];

    // Creating tile grid
    tile = self.svg.selectAll("rect")

};

/**
 * Returns the class that needs to be assigned to an element.
 *
 * @param party an ID for the party that is being referred to.
 */
TileChart.prototype.chooseClass = function (party) {
    var self = this;
    if (party == "R") {
        return "republican";
    }
    else if (party == "D") {
        return "democrat";
    }
    else if (party == "I") {
        return "independent";
    }
}

/**
 * Renders the HTML content for tool tip.
 *
 * @param tooltip_data information that needs to be populated in the tool tip
 * @return text HTML content for tool tip
 */
TileChart.prototype.tooltip_render = function (tooltip_data) {
    var self = this;
    console.log("tooltip_data.winner = " + tooltip_data.winner);
    var text = "<h2 class =" + self.chooseClass(tooltip_data.winner) + " >" + tooltip_data.state + "</h2>";
    
    text += "Electoral Votes: " + tooltip_data.electoralVotes;
    text += "<ul>"
    tooltip_data.result.forEach(function (row) {

        if (row.nominee=="") {
        
        }
        else {
            text += "<li class = " + self.chooseClass(row.party) + ">" + row.nominee + ":\t\t" + row.votecount + "(" + row.percentage + "%)" + "</li>"

        }
    });

    text += "</ul>";
    return text;
}



/**
 * Creates tiles and tool tip for each state, legend for encoding the color scale information.
 *
 * @param electionResult election data for the year selected
 * @param colorScale global quantile scale based on the winning margin between republicans and democrats
 */
TileChart.prototype.update = function (electionResult, colorScale) {
    var self = this;

    //Calculates the maximum number of columns to be laid out on the svg
    self.maxColumns = d3.max(electionResult, function (d) {
        return parseInt(d["Space"]);
    });

    //Calculates the maximum number of rows to be laid out on the svg
    self.maxRows = d3.max(electionResult, function (d) {
        return parseInt(d["Row"]);
    });
    //for reference:https://github.com/Caged/d3-tip
    //Use this tool tip element to handle any hover over the chart
    tip = d3.tip().attr('class', 'd3-tip')
        .direction('se')
        .offset(function () {
            return [0, 0];
        })
        .html(function (d) {
            // populate data in the following format
            tooltip_data = {
                "state": d.State,
                "winner": d.winner,
                "electoralVotes": d.Total_EV,
                "result": [
                    { "nominee": d.D_Nominee, "votecount": d.D_Votes, "percentage": d.D_Percentage, "party": "D" },
                    { "nominee": d.R_Nominee, "votecount": d.R_Votes, "percentage": d.R_Percentage, "party": "R" },
                    { "nominee": d.I_Nominee, "votecount": d.I_Votes, "percentage": d.I_Percentage, "party": "I" }
                ]
            }
            //pass this as an argument to the tooltip_render function then,
            //return the HTML content returned from that method.

            return TileChart.prototype.tooltip_render(tooltip_data);
        });

    // Creates a legend element and assigns a scale that needs to be visualized
    var addLegend = self.legendSvg.append("g")
        .attr("class", "legendQuantile")

    var legendQuantile = d3.legendColor()
        .shapeWidth(60)
        .cells(10)
        .orient('horizontal')
        .scale(colorScale);


    var stringo = String("data/election-results-" + electionResult + ".csv");

    d3.csv(stringo, function (data) {

        // Mapping row and column to data
        mapLocations.forEach(function (d) {
            data.forEach(function (f) {
                if (d.state == f.Abbreviation) {
                    f.column = d.column;
                    f.row = d.row;
                }
            })
        })

        var dArray = [];
        var rArray = [];
        var iArray = [];

        // FROM ELECTORAL VOTE CHART--GETTING WIN %
        data.forEach(function (d) {
            // array of percentages
            percentageArray = [d.D_Percentage, d.R_Percentage, d.I_Percentage];
            // sorting percentages largest to smallest
            var order = percentageArray.sort(function (a, b) {
                return b - a;
            })

            if (order[0] == d.D_Percentage) {
                d.winMargin = order[1] - order[0];
                d.winner = "D";
                dArray.push(d);
                console.log("D IS BIG")
            }
            else if (order[0] == d.R_Percentage) {
                d.winMargin = order[0] - order[1];
                d.winner = "R";
                rArray.push(d);
                console.log("R IS BIG")
            }
            else {
                d.winMargin = order[0] - order[1];
                d.winner = "I";
                iArray.push(d);
                console.log("I IS BIG")
            }
        })

        // sorting arrays by win margin    
        dArray.sort(function (a, b) {
            return a.winMargin - b.winMargin;
        })
        rArray.sort(function (a, b) {
            return a.winMargin - b.winMargin;
        })
        iArray.sort(function (a, b) {
            return b.winMargin - a.winMargin;
        })

        // making one large array to combine all the data
        var totalArray = []
        iArray.forEach(function (d) {
            totalArray.push(d);
        })
        dArray.forEach(function (d) {
            totalArray.push(d);
        })
        rArray.forEach(function (d) {
            totalArray.push(d);
        })

        // adding the legend
        addLegend
            .attr("transform", "translate (0,50)")
            .style("font-size", "10px")
            .call(legendQuantile);

        // Appending rectangles
        tile
            .data(totalArray)
            .enter()
            .append("rect")
            .attr("x", function (d, i) {
                return d.column;
            })
            .attr("y", function (d) {
                return d.row;
            })
            .attr("width", 50)
            .attr("height", 40)
            .attr("fill", function(d) {
                if (d.winner == "I") {
                    return "green";
                }
                else {
                    return colorScale(d.winMargin);
                }
            })
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide);

        self.svg.call(tip);
            
        
        tile.data(totalArray)
            .attr("x", function (d, i) {
                return d.column;
            })
            .attr("y", function (d) {
                return d.row;
            })
            .attr("width", 50)
            .attr("height", 40)
            .attr("fill", function(d) {
                if (d.winner == "I") {
                    return "green";
                }
                else {
                    return colorScale(d.winMargin);
                }
            })
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide);

        self.svg.call(tip);

        // Appending text
        tile
            .data(totalArray)
            .enter()
            .append("text")
            .attr("class", function (d, i) {
                return self.chooseClass(totalArray[i].PARTY) + " tilestext";
            })
            .attr("x", function (d, i) {
                return d.column + 25;
            })
            .attr("y", function (d) {
                return d.row + 20;
            })
            .text(function (d) {
                return d.Abbreviation;
            })
        
        tile
            .data(totalArray)
            .attr("class", function (d, i) {
                return self.chooseClass(totalArray[i].PARTY) + " tilestext";
            })
            .attr("x", function (d, i) {
                return d.column + 25;
            })
            .attr("y", function (d) {
                return d.row + 20;
            })
            .text(function (d) {
                return d.state;
            })

        tile.exit().remove();



    });

    // ******* TODO: PART IV *******
    //Tansform the legend element to appear in the center and make a call to this element for it to display.

    //Lay rectangles corresponding to each state according to the 'row' and 'column' information in the data.

    //Display the state abbreviation and number of electoral votes on each of these rectangles

    //Use global color scale to color code the tiles.

    //HINT: Use .tile class to style your tiles;
    // .tilestext to style the text corresponding to tiles

    //Call the tool tip on hover over the tiles to display stateName, count of electoral votes
    //then, vote percentage and number of votes won by each party.
    //HINT: Use the .republican, .democrat and .independent classes to style your elements.
};

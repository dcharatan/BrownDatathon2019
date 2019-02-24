/**
 * Constructor for the Year Chart
 * @param electionWinners inastance of electionWinners
 * @param electionInfo instance of ElectionInfo
 */
function StateMap(electionWinners) {
    var self = this;
    self.electionWinners = electionWinners;
    self.init();
};

/**
 * Initializes the svg elements required for this chart
 */
StateMap.prototype.init = function () {
    var self = this;

};

/**
 * Returns the class that needs to be assigned to an element.
 *
 * @param party an ID for the party that is being referred to.
 */
StateMap.prototype.chooseClass = function (party) {
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
 * This is the update you want because it's the one we wrote :)))))
 */
StateMap.prototype.betterUpdate = function(the_year, data_column) {
    // Reads the CSV.
    var fileName = String("data/cdc-data.csv");
    d3.csv(fileName, function (data) {
        // Defines the gradient.
        var min = null;
        var max = null;
        data.forEach(function (d) {
            if(d.year == Math.floor(the_year)) {
                if(min == null || d[data_column] < min) {
                    min = d[data_column];
                }
                if(max == null || d[data_column] > max) {
                    max = d[data_column];
                }
            }
        });

        // Defines the gradient.
        var domain = [min, max];
        var range = ["#ef717a", "#394c81"];
        var colorScale = d3.scaleLinear().domain(domain).range(range);
        
        var heights = [];
        var colors = [];
        data.forEach(function (d) {
            var element = document.getElementById(d.state)
            if(element != null && d.year == Math.floor(the_year)) {
                console.log(d.state);
                console.log(d.weight_avg);
                element.setAttribute("fill", colorScale(d[data_column]));
                heights.push((max - d[data_column]) / (max - min) * 64);
                colors.push((max - d[data_column]) / (max - min) * 64);
            }
        });
        update_qr_code(heights, colors, document.getElementById("qr-box"), document.getElementById("output_instructions"));
    });
}

StateMap.prototype.update = function (electionResult, colorScale) {
    var self = this;


    //for reference:https://github.com/Caged/d3-tip
    //Use this tool tip element to handle any hover over the chart
    // TIP IS NOT IMPLEMENTED RIGHT
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

            return StateMap.prototype.tooltip_render(tooltip_data);
        });

    // Creates a legend element and assigns a scale that needs to be visualized


    var stringo = String("data/election-results-" + electionResult + ".csv");

    d3.csv(stringo, function (data) {

        var dArray = [];
        var rArray = [];
        var iArray = [];
        
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

        
        data.forEach(function (d) {
            var bug = ""
            bug = d.Abbreviation;

            console.log(colorScale(d.winMargin))
            var element = document.getElementById(bug)
            element.setAttribute("fill", colorScale(d.winMargin));
                
            console.log("color is" + colorScale(d.winMargin))
        })
        //self.svg.call(tip);


    });

};

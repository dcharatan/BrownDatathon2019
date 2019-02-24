/*
 * Root file that handles instances of all the charts and loads the visualization
 */
(function () {
    var instance = null;

    /**
     * Creates instances for every chart (classes created to handle each chart;
     * the classes are defined in the respective javascript files.
     */
    function init() {
        // Does the layout for the position-critical elements.
        // nah jk we're hacking it :))))
        /*var view_width = window.innerWidth;
        var view_height = window.innerHeight;
        document.getElementById('container-left').style.width = view_height + "px";
        document.getElementById('container-left').style.height = view_height + "px";
        document.getElementById('container-left').style.width = (view_width - view_height) + "px";*/

        var stateMap = new StateMap();
        InteractionInit(stateMap);

        d3.csv("data/yearwise-winner.csv", function (error, electionWinners) {

            // passing the data to the yearchart 
            var yearChart = new YearChart(stateMap, electionWinners);
            yearChart.update();
        });

    }

    /**
     *
     * @constructor
     */
    function Main() {
        if (instance !== null) {
            throw new Error("Cannot instantiate more than one Class");
        }
    }

    /**
     *
     * @returns {Main singleton class |*}
     */
    Main.getInstance = function () {
        var self = this
        if (self.instance == null) {
            self.instance = new Main();

            init();
        }
        return instance;
    }

    Main.getInstance();
})();
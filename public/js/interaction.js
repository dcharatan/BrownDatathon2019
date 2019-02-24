/**
 * Constructor for interaction.
 */
var stateMap;
function InteractionInit(the_stateMap) {
    stateMap = the_stateMap;
};

$(document).ready(function() {
    $("#dataSelectorButton1").click(function() {
        stateMap.betterUpdate(2010, "seatbelt_avg");
    });
    $("#dataSelectorButton2").click(function() {
        stateMap.betterUpdate(2010, "exercise_avg");
    });
    $("#dataSelectorButton3").click(function() {
        stateMap.betterUpdate(2010, "smoke_avg");
    });
    $("#dataSelectorButton4").click(function() {
        stateMap.betterUpdate(2010, "drink_avg");
    });
    $("#dataSelectorButton5").click(function() {
        stateMap.betterUpdate(2010, "checkup_avg");
    });
    $("#dataSelectorButton6").click(function() {
        stateMap.betterUpdate(2010, "healthcare_avg");
    });
    $("#dataSelectorButton7").click(function() {
        stateMap.betterUpdate(2010, "weight_avg");
    });
    $("#dataSelectorButton8").click(function() {
        stateMap.betterUpdate(2010, "height_avg");
    });
    $("#playButton").click(function() {
        stateMap.betterUpdate();
    });
    $("#pauseButton").click(function() {
        alert("pause button clicked.");
    });
    $("#stopButton").click(function() {
        alert("pause button clicked.");
    });
});

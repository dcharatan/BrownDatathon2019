/**
 * Constructor for interaction.
 */
var stateMap;
var paused;
var current_year;
var current_data;
function InteractionInit(the_stateMap) {
    stateMap = the_stateMap;
    paused = false;
    current_year = 2004;
    current_data = null;

    let i = 2004;
    setInterval(function() {
        if(paused == false) {
            current_year += 0.25;
            if(current_year >= 2018) {
                current_year = 2004;
            }
            if(current_data != null) {
                update_it();
            }
        }
    }, 100);
};

function update_it() {
    document.getElementById("year_p").innerHTML = "Current year: " + Math.round(current_year * 10) / 10;
    stateMap.betterUpdate(current_year, current_data);
}

$(document).ready(function() {
    $("#dataSelectorButton1").click(function() {
        document.getElementById("description-title").innerHTML = "Seatbelt: Average Frequency of Seatbelt Use";
        document.getElementById("description-body").innerHTML = "Qualitative values from “never” to “always” translated to numeric values. Darker purple indicates higher seatbelt use.";
        current_data = "seatbelt_avg";
        update_it();
    });
    $("#dataSelectorButton2").click(function() {
        document.getElementById("description-title").innerHTML = "Exercise: Percent of the Population who Exercised in the past 30 Days";
        document.getElementById("description-body").innerHTML = "Normalized for population. Darker purple indicates greater prevalence of exercise.";
        current_data = "exercise_avg";
        update_it();
    });
    $("#dataSelectorButton3").click(function() {
        document.getElementById("description-title").innerHTML = "Smoking: Portion of people who have smoked over 100 cigarettes (5 packs) in their lifetime";
        document.getElementById("description-body").innerHTML = "Darker purple indicates more smokers per capita.";
        current_data = "smoke_avg";
        update_it();
    });
    $("#dataSelectorButton4").click(function() {
        document.getElementById("description-title").innerHTML = "Drinking: Portion of people who have consumed one or more alcoholic beverage in the past thirty days";
        document.getElementById("description-body").innerHTML = "Normalized for population. Darker purple indicates more drinkers per capita.";
        current_data = "drink_avg";
        update_it();
    });
    $("#dataSelectorButton5").click(function() {
        document.getElementById("description-title").innerHTML = "Checkups: Average number of years between non-urgent checkups";
        document.getElementById("description-body").innerHTML = "Darker purple indicates more years.";
        current_data = "checkup_avg";
        update_it();
    });
    $("#dataSelectorButton6").click(function() {
        document.getElementById("description-title").innerHTML = "Healthcare: Portion of residents with a healthcare plan";
        document.getElementById("description-body").innerHTML = "Darker purple indicates more healthcare.";
        current_data = "healthcare_avg";
        update_it();
    });
    $("#dataSelectorButton7").click(function() {
        document.getElementById("description-title").innerHTML = "Obesity: Average weight of population";
        document.getElementById("description-body").innerHTML = "Darker purple indicates heavier people.";
        current_data = "weight_avg";
        update_it();
    });
    $("#dataSelectorButton8").click(function() {
        document.getElementById("description-title").innerHTML = "Height: Average height of population";
        document.getElementById("description-body").innerHTML = "Darker purple indicates taller people.";
        current_data = "height_avg";
        update_it();
    });
});
$(document).ready(function() {
    $("#playButton").click(function() {
        paused = false;
        if(current_data != null) {
            update_it();
        }
    });
});
$(document).ready(function() {
    $("#pauseButton").click(function() {
        paused = true;
        if(current_data != null) {
            update_it();
        }
    });
});
$(document).ready(function() {
    $("#stopButton").click(function() {
        current_year = 2004;
        paused = true;
        if(current_data != null) {
            update_it();
        }
    });
});
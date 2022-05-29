let isEditing = false;
let currentElement = "";
let currentCustomLayout = {};

function toggleEditMode() {
    let mouseHeld = false;
    if (!isEditing) {
        // Turning on edit mode
        console.log("Turning on edit mode");
        pause = true;
        $('#time').html("Editing Layout....");
        $('#time').addClass("hijacked");
        $('#date').html("Click and drag elements to move them.");

        $("#edit-toggle").html("<i class='fa fa-save' title='Finish Editing'></i>");
        $(".weather-container").addClass("editing");
        $(".search-container").addClass("editing");
        $(".link-box").addClass("editing");
        $("#xkcd-zone").addClass("editing");

        $(document).click(function(e) {
            if (isEditing)
                e.preventDefault();
        });

        $(".editing").mousedown(function(e) {
            if (isEditing) {
                e.preventDefault();
                if (e.which == 1) {
                    mouseHeld = true;
                    currentElement = $(this);
                    $(this).addClass("dragging");
                }
            }
        });

        $(document).mouseup(function(e) {
            if (isEditing) {
                e.preventDefault();
                if (e.which == 1) {
                    mouseHeld = false;
                }
                if (currentElement)
                    currentElement.removeClass("dragging");
            }
        });

        $(document).mousemove(function(e) {
            if (isEditing) {
                e.preventDefault();
                if (mouseHeld) {
                    let x = e.pageX - currentElement.width() / 2;
                    let y = e.pageY - currentElement.height() / 2;
                    let percentX = x / $(window).width() * 100;
                    // let percentY = y / $(window).height() * 100;
                    if (percentX < 0) {
                        percentX = 0;
                    }
                    if (percentX > 99) {
                        percentX = 99;
                    }
                    currentElement.css("left", percentX + "%");
                    currentElement.css("top", y + "px");
                }
            }
        });
    } else {
        // Turning off edit mode
        console.log("Saving changes");
        pause = false;
        $('#time').removeClass("hijacked");
        timer();

        $("#edit-toggle").html("<i class='fa-solid fa-pen-ruler' title='Edit Layout'></i>");
        $(".editing").removeClass("editing");
        $(".dragging").removeClass("dragging");
        currentCustomLayout = getCustomLayout();
        saveToLS(false);
    }
    isEditing = !isEditing;
}

function getCustomLayout() {
    let layout = {};
    layout.weather1 = {};
    layout.weather2 = {};
    layout.search = {};
    layout.link = {};
    layout.xkcd = {};

    layout.weather1.x = $("#weather-1")[0].style.left;
    layout.weather1.y = $("#weather-1")[0].style.top;
    layout.weather2.x = $("#weather-2")[0].style.left;
    layout.weather2.y = $("#weather-2")[0].style.top;
    layout.search.x = $("#search-bar")[0].style.left;
    layout.search.y = $("#search-bar")[0].style.top;
    layout.link.x = $("#link-box")[0].style.left;
    layout.link.y = $("#link-box")[0].style.top;
    layout.xkcd.x = $("#xkcd-zone")[0].style.left;
    layout.xkcd.y = $("#xkcd-zone")[0].style.top;

    return layout;
}

function setCustomLayout(layout) {
    $("#weather-1").css("left", layout.weather1.x);
    $("#weather-1").css("top", layout.weather1.y);
    $("#weather-2").css("left", layout.weather2.x);
    $("#weather-2").css("top", layout.weather2.y);
    $("#search-bar").css("left", layout.search.x);
    $("#search-bar").css("top", layout.search.y);
    $("#link-box").css("left", layout.link.x);
    $("#link-box").css("top", layout.link.y);
    $("#xkcd-zone").css("left", layout.xkcd.x);
    $("#xkcd-zone").css("top", layout.xkcd.y);
}

function disableCustomLayout() {
    $("#weather-1")[0].style.left = "";
    $("#weather-1")[0].style.top = "";
    $("#weather-2")[0].style.left = "";
    $("#weather-2")[0].style.top = "";
    $("#search-bar")[0].style.left = "";
    $("#search-bar")[0].style.top = "";
    $("#link-box")[0].style.left = "";
    $("#link-box")[0].style.top = "";
    $("#xkcd-zone")[0].style.left = "";
    $("#xkcd-zone")[0].style.top = "";
}

$("#custom-position-toggle").on("change", function() {
    if (!$(this).is(":checked")) {
        console.log("Disabling custom layout");
        disableCustomLayout();
    } else {
        console.log("Enabling custom layout");
        setCustomLayout(currentCustomLayout);
    }
});

function getDefaultLayoutAsPercent() {
    let layout = {};
    layout.weather1 = {};
    layout.weather2 = {};
    layout.search = {};
    layout.link = {};
    layout.xkcd = {};

    layout.weather1.x = parseFloat($("#weather-1").css("left")) / $(window).width() * 100 + "%";
    layout.weather1.y = $("#weather-1").css("top");
    layout.weather2.x = parseFloat($("#weather-2").css("left")) / $(window).width() * 100 + "%";
    layout.weather2.y = $("#weather-2").css("top");
    layout.search.x = parseFloat($("#search-bar").css("left")) / $(window).width() * 100 + "%";
    layout.search.y = $("#search-bar").css("top");
    layout.link.x = parseFloat($("#link-box").css("left")) / $(window).width() * 100 + "%";
    layout.link.y = $("#link-box").css("top");
    layout.xkcd.x = parseFloat($("#xkcd-zone").css("left")) / $(window).width() * 100 + "%";
    layout.xkcd.y = $("#xkcd-zone").css("top");

    return layout;
}
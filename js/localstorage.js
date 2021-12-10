let backgroundKeys = ["background", "weatherBoxBackground", "modalBackground", "linkBoxBackground", "buttonBackground"];
let base64String = "";

let saveToLS = function() {
    let userCSS = constructUserCSS();
    console.log("%cSaving user config...", "color:lightblue");
    let data = {
        "theme": {
            "colours": userCSS
        },
        "weather": {
            "code1": $("#weather-code-1").val(),
            "code2": $("#weather-code-2").val(),
            "units": $("#unit-selector").val(),
            "autoRefresh": $("#weather-auto-refresh").prop("checked")
        },
        "links": {
            "link1": {
                "name": $("#link-name-1").val(),
                "url": $("#link-url-1").val()
            },
            "link2": {
                "name": $("#link-name-2").val(),
                "url": $("#link-url-2").val()
            },
            "link3": {
                "name": $("#link-name-3").val(),
                "url": $("#link-url-3").val()
            },
            "link4": {
                "name": $("#link-name-4").val(),
                "url": $("#link-url-4").val()
            },
            "link5": {
                "name": $("#link-name-5").val(),
                "url": $("#link-url-5").val()
            },
            "link6": {
                "name": $("#link-name-6").val(),
                "url": $("#link-url-6").val()
            },
            "show": $("#show-link-box").prop("checked")
        },
        "misc": {
            "updateCheck": $("#update-toggle").prop("checked"),
            "showXKCD": $("#xkcd-toggle").prop("checked"),
            "invertXKCD": $("#invert-toggle").prop("checked"),
            "dateFormat": $("#date-format").val(),
            "timeFormat": $("#time-format").val()
        }
    };

    let success = false;
    try {
        localStorage.setItem("404CONFIG", JSON.stringify(data));
        success = true;
    } catch (DOMException) {
        console.log("%c" + "Image too big!", "color:red");
        alert("Image too big!\n\nPlease select a smaller image.\nThe max size is ~3MB.");
    }

    if (success) {
        console.log("%c" + "Saved!", "color:lightgreen");
        loadFromLS();
        hideModal();
    }

};

let loadFromLS = function() {
    let data = JSON.parse(localStorage.getItem("404CONFIG"));
    if (data) {
        $("head").children("style").each(function() {
            $(this).remove();
        });
        $("head").append($("<style>").html(data.theme.colours));
        $(".theme-val").each(function() {
            $(this).val(styleVar($(this).attr("id")));
        });

        $("#weather-code-1").val(data.weather.code1);
        $("#weather-code-2").val(data.weather.code2);
        $("#unit-selector").val(data.weather.units);
        $("#weather-auto-refresh").prop("checked", data.weather.autoRefresh);

        $("#link-name-1").val(data.links.link1.name);
        $("#link-url-1").val(data.links.link1.url);
        $("#link1").prop("href", data.links.link1.url).text(data.links.link1.name);

        $("#link-name-2").val(data.links.link2.name);
        $("#link-url-2").val(data.links.link2.url);
        $("#link2").prop("href", data.links.link2.url).text(data.links.link2.name);

        $("#link-name-3").val(data.links.link3.name);
        $("#link-url-3").val(data.links.link3.url);
        $("#link3").prop("href", data.links.link3.url).text(data.links.link3.name);

        $("#link-name-4").val(data.links.link4.name);
        $("#link-url-4").val(data.links.link4.url);
        $("#link4").prop("href", data.links.link4.url).text(data.links.link4.name);

        $("#link-name-5").val(data.links.link5.name);
        $("#link-url-5").val(data.links.link5.url);
        $("#link5").prop("href", data.links.link5.url).text(data.links.link5.name);

        $("#link-name-6").val(data.links.link6.name);
        $("#link-url-6").val(data.links.link6.url);
        $("#link6").prop("href", data.links.link6.url).text(data.links.link6.name);

        $("#show-link-box").prop("checked", data.links.show);
        $("#update-toggle").prop("checked", data.misc.updateCheck);
        $("#xkcd-toggle").prop("checked", data.misc.showXKCD);
        $("#invert-toggle").prop("checked", data.misc.invertXKCD);
        $("#date-format").val(data.misc.dateFormat || "%W, %MMMM %d, %Y");
        $("#time-format").val(data.misc.timeFormat || "%h:%m:%s %a");

        dateFormatString = data.misc.dateFormat || "%W, %MMMM %d, %Y";
        timeFormatString = data.misc.timeFormat || "%h:%m:%s %a";

        if (data.links.show) {
            $(".link-box").css("display", "block");
            $("#xkcd-zone").css("top", "850px");
        } else {
            $(".link-box").css("display", "none");
            $("#xkcd-zone").css("top", "450px");
        }

        if (data.misc.updateCheck) {
            checkForUpdate(false);
        }

        if (data.weather.autoRefresh) {
            function weatherRefresh() {
                getWeatherInfo(data.weather.code1, data.weather.code2, data.weather.units);
            }
            setInterval(weatherRefresh, 600000);
        }

        if (data.misc.showXKCD) {
            $("#xkcd-zone").css("display", "block");
        } else {
            console.log("%cXKCD disabled", "color:lightblue");
        }
        if (data.misc.invertXKCD) {
            $("#x-img").css("filter", "invert(1)");
        } else {
            $("#x-img").css("filter", "invert(0)");
        }

        getWeatherInfo(data.weather.code1, data.weather.code2, data.weather.units);
        showLinkGroup(0);
    } else {
        console.log("%cNo config found, setting defaults.", "color:red");
        $("head").append($("<link>").attr({ "rel": "stylesheet", "href": "css/colours.css" }));
        $(".theme-val").each(function() {
            // console.log($(this).attr("id"));
            $(this).val(styleVar($(this).attr("id")));
        });


        $("#weather-code-1").val(6167865);
        $("#weather-code-2").val(6077243);
        $("#show-link-box").prop("checked", true);
        $("#update-toggle").prop("checked", true);

        getWeatherInfo(6167865, 6077243, "metric");
        showLinkGroup(0);

        function loadDefaultValues() {
            $(".theme-val").each(function() {
                // console.log($(this).attr("id"));
                $(this).val(styleVar($(this).attr("id")));
            });
            saveToLS();
        }
        setTimeout(loadDefaultValues, 100);
    }

    function unblur() {
        $('html').css('filter', 'none');
    }
    setTimeout(unblur, 250);
}

let showLinkGroup = function() {
    let x = parseInt($("#link-selector").val());
    $(".link-group").css("display", "none");
    $("#link-config-" + x).css("display", "block");
}

let constructUserCSS = function() {
    console.log("%c" + "Constructing user CSS", "color:lightblue");
    let data = JSON.parse(localStorage.getItem("404CONFIG"));
    let userCSS = "* {";
    if ($("#backgroundImage").val() == "") {
        userCSS += " --backgroundImage: " + styleVar("backgroundImage") + ";";
    } else {
        userCSS += " --backgroundImage: url(data:image/jpg;base64," + base64String + ");";
    }
    $(".theme-val").each(function() {
        // console.log($(this).attr("id"));
        userCSS += " --" + $(this).attr("id") + ": " + $(this).val();
        if (backgroundKeys.includes($(this).attr("id"))) {
            // console.log("%c" + "background key", "color:red");
            let alpha = 255 * Number($("#alpha").val());
            userCSS += Math.round(alpha).toString(16);
        } else if ($(this).attr("id") == "borderRadius") {
            userCSS += "px";
        }
        userCSS += ";";
    });
    userCSS += "}";
    return userCSS;
}

function imageUploaded() {
    let file = document.querySelector('input[id=backgroundImage]')['files'][0];

    let reader = new FileReader();
    reader.onload = function() {
        base64String = reader.result.replace("data:", "")
            .replace(/^.+,/, "");
        // console.log(base64String);
    }
    reader.readAsDataURL(file);
}

function styleVar(key) {
    if (backgroundKeys.includes(key)) {
        return getComputedStyle(document.documentElement).getPropertyValue("--" + key).trim().slice(0, 7);
    } else if (key == "borderRadius") {
        return getComputedStyle(document.documentElement).getPropertyValue("--" + key).trim().slice(0, -2);
    }
    return getComputedStyle(document.documentElement).getPropertyValue("--" + key).trim();
}

let exportConfig = function() {
    saveToLS();
    console.log("%c" + "Exporting config...", "color:lightblue");
    let themeJSON = localStorage.getItem("404CONFIG");
    let file = new Blob([themeJSON], { type: "application/json" });
    let a = document.createElement("a");

    a.href = URL.createObjectURL(file);
    a.download = "404-Start_" + Date.now() + ".json";
    document.body.appendChild(a);
    a.click();
    setTimeout(function() {
        document.body.removeChild(a); //Remove it
        window.URL.revokeObjectURL(a.href); //Get rid of the url to our file
    }, 0);
}

let importTrigger = function() {
    console.log("%c" + "Importing config...", "color:lightblue");
    $("#import-theme-button").click();
}

let importConfig = function() {
    let file = document.querySelector('input[id=import-theme-button]')['files'][0];
    let reader = new FileReader();
    reader.onload = function() {
        try {
            let data = JSON.parse(reader.result);
            localStorage.setItem("404CONFIG", JSON.stringify(data));
            console.log("%c" + "Theme import successful!", "color:green");
            loadFromLS();
            hideModal();
        } catch (e) {
            console.log("%c" + "Error importing config.", "color:red");
            alert("Error importing config. Ensure the file is valid JSON.");
        }
    }
    reader.readAsText(file);
}

loadFromLS();

// Event listener to monitor changes made in other tabs/windows
// This prevents desyncs
window.addEventListener('storage', function(event) {
    loadFromLS();
});
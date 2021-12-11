let backgroundKeys = ["background", "weatherBoxBackground", "modalBackground", "linkBoxBackground", "buttonBackground", "headerBackground"];
let base64String = "";
let dataVersion = 1;
let minimumSupportedDataVersion = 0;

let saveToLS = function(reload) {
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
        },
        "version": dataVersion
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
        if (reload) {
            loadFromLS();
        }
        hideModal();
    }

};

let loadFromLS = function() {
    let data = JSON.parse(localStorage.getItem("404CONFIG"));
    let saveAfterLoad = false;

    if (!data) {
        console.log("%cNo config found, setting defaults.", "color:red");
        $(".theme-val").each(function() {
            $(this).val(styleVar($(this).attr("id")));
        });
        saveAfterLoad = true;
        saveToLS(false);
        data = JSON.parse(localStorage.getItem("404CONFIG"));
    }

    $("head").children("style").each(function() {
        $(this).remove();
    });
    $("head").append($("<style>").html(data.theme.colours));

    $(".theme-val").each(function() {
        $(this).val(styleVar($(this).attr("id")));
    });

    $('#boxAlphaVal').html(($('#boxAlpha').val() * 100).toFixed(0) + '%');
    $('#headerAlphaVal').html(($('#headerAlpha').val() * 100).toFixed(0) + '%');
    $('#borderRadiusVal').html($('#borderRadius').val() + 'px');

    $("#weather-code-1").val(data.weather.code1 || 6167865);
    $("#weather-code-2").val(data.weather.code2 || 6077243);
    $("#unit-selector").val(data.weather.units || "metric");
    $("#weather-auto-refresh").prop("checked", data.weather.autoRefresh || false);
    $('#weatherBoxMarginVal').html($('#weatherBoxMargin').val() + '%');

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

    $("#show-link-box").prop("checked", data.links.show || false);
    $("#update-toggle").prop("checked", data.misc.updateCheck || false);
    $("#xkcd-toggle").prop("checked", data.misc.showXKCD || false);
    $("#invert-toggle").prop("checked", data.misc.invertXKCD || false);
    $("#date-format").val(data.misc.dateFormat || "%W, %MMMM %d, %Y");
    $("#time-format").val(data.misc.timeFormat || "%hh:%m:%s %a");

    dateFormatString = data.misc.dateFormat || "%W, %MMMM %d, %Y";
    timeFormatString = data.misc.timeFormat || "%hh:%m:%s %a";

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
        $("#xkcd-zone").css("display", "none");
    }
    if (data.misc.invertXKCD) {
        $("#x-img").css("filter", "invert(1)");
    } else {
        $("#x-img").css("filter", "invert(0)");
    }

    if (saveAfterLoad) {
        saveToLS(false);
    }

    getWeatherInfo(data.weather.code1, data.weather.code2, data.weather.units);
    showLinkGroup(0);

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
    console.log("%c" + "Constructing user CSS...", "color:lightblue");
    let data = JSON.parse(localStorage.getItem("404CONFIG"));
    let userCSS = "* {";
    if ($("#backgroundImage").val() == "") {
        userCSS += " --backgroundImage: " + styleVar("backgroundImage") + ";";
    } else {
        userCSS += " --backgroundImage: url(data:image/jpg;base64," + base64String + ");";
    }
    $(".theme-val").each(function() {
        userCSS += " --" + $(this).attr("id") + ": " + $(this).val();
        if ($(this).attr("id") == "headerBackground") {
            let alpha = 255 * Number($("#headerAlpha").val());
            userCSS += Math.round(alpha).toString(16);
        } else if (backgroundKeys.includes($(this).attr("id"))) {
            let alpha = 255 * Number($("#boxAlpha").val());
            userCSS += Math.round(alpha).toString(16);
        } else if ($(this).attr("id") == "borderRadius") {
            userCSS += "px";
        } else if ($(this).attr("id") == "weatherBoxMargin") {
            userCSS += "%";
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
        base64String = reader.result.replace("data:", "").replace(/^.+,/, "");
    }
    reader.readAsDataURL(file);
}

function styleVar(key) {
    if (backgroundKeys.includes(key)) {
        return getComputedStyle(document.documentElement).getPropertyValue("--" + key).trim().slice(0, 7);
    } else if (key == "borderRadius") {
        return getComputedStyle(document.documentElement).getPropertyValue("--" + key).trim().slice(0, -2);
    } else if (key == "weatherBoxMargin") {
        return getComputedStyle(document.documentElement).getPropertyValue("--" + key).trim().slice(0, -1);
    }
    return getComputedStyle(document.documentElement).getPropertyValue("--" + key).trim();
}

let exportConfig = function() {
    saveToLS(true);
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
        let oldData = JSON.parse(localStorage.getItem("404CONFIG"));
        try {
            let data = JSON.parse(reader.result);
            let incomingDataVersion = data.version || 0; // assume 1 if no version is given
            console.log("%c" + "Current data version: " + dataVersion, "color:lightblue");
            console.log("%c" + "Minimum data version: " + minimumSupportedDataVersion, "color:lightblue");
            console.log("%c" + "Incoming data version: " + incomingDataVersion, "color:lightblue");
            if (minimumSupportedDataVersion > incomingDataVersion) {
                console.log("%c" + "Incompatible theme: data version " + incomingDataVersion, "color:red");
                alert("This configuration file is from an older version of 404 Start, and cannot be imported.");
                return;
            }
            if (JSON.stringify(data) === JSON.stringify(oldData)) {
                console.log("%c" + "No changes detected.", "color:lightblue");
                return;
            }
            localStorage.setItem("404CONFIG", JSON.stringify(data));
            console.log("%c" + "Theme import successful!", "color:green");
            loadFromLS();
            hideModal();
        } catch (e) {
            console.log("%c" + "Error importing config.", "color:red");
            alert("Error importing config.\nEnsure the file is valid JSON, and an actual theme config.\n\n" + e);
            localStorage.setItem("404CONFIG", JSON.stringify(oldData)); //restore old config
            loadFromLS();
        }
    }
    reader.readAsText(file);
    $("#import-theme-button").val("");
}

function firefoxCheck() {
    // hacky fixes for some Firefox oddities
    if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
        $("#close").css("margin-left", "236px");
        $("input[type=range]").css("margin-bottom", "0px");
        $("input[type=range]").css("margin-top", "0px");
        $("input[type=range]").css("transform", "translateY(3.5px)");
        $(".small-button i").css("vertical-align", "top");
        $(".alert-button").css("margin-top", "95px");
        $(".alert-button").css("margin-left", "-17px");
    }
}

loadFromLS();
firefoxCheck();

// Event listener to monitor changes made in other tabs/windows
// This prevents desyncs
window.addEventListener('storage', function(event) {
    loadFromLS();
});
var backgroundKeys = ["background", "weatherBoxBackground", "modalBackground", "linkBoxBackground", "buttonBackground"];

var saveToLS = function() {
    var userCSS = constructUserCSS();
    console.log("%cSaving user config...", "color:lightblue");
    var data = {
        "theme": {
            "image": $("#theme-image").val(),
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
        }
    };
    localStorage.setItem("404CONFIG", JSON.stringify(data));

    loadFromLS();
    hideModal("#config-window");
};

var loadFromLS = function() {
    var data = JSON.parse(localStorage.getItem("404CONFIG"));
    if (data) {
        $("head").children("style").each(function() {
            $(this).remove();
        });
        $("head").append($("<style>").html(data.theme.colours));
        $(".theme-val").each(function() {
            // console.log($(this).attr("id"));
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
        if (data.links.show) {
            $(".link-box").css("display", "block");
        } else {
            $(".link-box").css("display", "none");
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

var showLinkGroup = function() {
    var x = parseInt($("#link-selector").val());
    $(".link-group").css("display", "none");
    $("#link-config-" + x).css("display", "block");
}

var constructUserCSS = function() {
    console.log("%c" + "Constructing user CSS", "color:lightblue");
    var data = JSON.parse(localStorage.getItem("404CONFIG"));
    var userCSS = "* {";
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
            var alpha = 255 * Number($("#alpha").val());
            console.log(alpha);
            userCSS += Math.round(alpha).toString(16);
        } else if ($(this).attr("id") == "borderRadius") {
            userCSS += "px";
        }
        userCSS += ";";
    });
    userCSS += "}";
    return userCSS;
}

let base64String = "";

function imageUploaded() {
    var file = document.querySelector(
        'input[type=file]')['files'][0];

    var reader = new FileReader();
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

loadFromLS();
let icons = new Skycons({ "color": "white" });
let apiKeys = ["ac44343b90759cfe705813ff3a614fa5", "c974b8da946cbf11c238f30fff7cbbd9"];
//We dual-wield API keys, so we don't overload a single one. I'm a cheap bastard, what can I say?

function getWeatherInfo(code1, code2, units) {
    // return; //for debugging
    let weatherURL1 = "https://api.openweathermap.org/data/2.5/weather?id=" + code1 + "&appid=" + apiKeys[0] + "&units=" + units;
    let weatherURL2 = "https://api.openweathermap.org/data/2.5/weather?id=" + code2 + "&appid=" + apiKeys[1] + "&units=" + units;
    getOpenWeatherData(weatherURL1, "#weather-1", units);
    getOpenWeatherData(weatherURL2, "#weather-2", units);
}

function getOpenWeatherData(URL, boxID, units) {
    let oneCallURL = "";
    let tempUnit = "°C";
    let windUnit = "km/h"
    let windScale = 1.609344;
    let alertModalID = boxID.replace('weather', 'alert-modal');
    let iconID = boxID.replace('weather', 'weather-icon').replace('#', '');
    if (units == "imperial") {
        tempUnit = "°F";
        windUnit = "mph";
        windScale = 1;
    }
    $.getJSON(URL, function(data) {
        // Yes, we call one API to get the lat/long of the city, and use that to call another API.
        // Yes, its stupid as hell, but it works.
        let long = data.coord.lon;
        let lat = data.coord.lat;
        let name = data.name;

        console.log("%cGetting weather for " + name + "...", "color:yellow;font-weight:bold;font-style:italic;");
        $(boxID + ' .weather-name').text(name);
        $(alertModalID + " .modal-header").text("Alerts for " + name);
        $(alertModalID + " .modal-body").empty();

        let apiKey = "";
        if (boxID == "#weather-1") {
            apiKey = apiKeys[0];
        } else if (boxID == "#weather-2") {
            apiKey = apiKeys[1];
        }
        oneCallURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "6&appid=" + apiKey + "&exclude=minutely,hourly&units=" + units;
    }).then(() => {
        $.getJSON(oneCallURL, function(data) {
            // Hacky workarounds for wind and sleet conditions
            if (data.current.wind_speed > 20) {
                setIcon("w", iconID);
                data.current.weather[0].description += " & Windy";
            } else if (data.current.weather[0].description.includes("sleet")) {
                setIcon("s", iconID);
            } else {
                setIcon(data.current.weather[0].icon, iconID);
            }
            icons.play();

            $(boxID + ' .temperature').html(data.current.temp + tempUnit);
            $(boxID + ' .conditions').html(titleCase(data.current.weather[0].description));
            if (data.current.feels_like) {
                $(boxID + ' .feels-like').html("<b>Feels Like: </b>" + data.current.feels_like.toFixed(1) + tempUnit);
            } else {
                $(boxID + ' .feels-like').remove();
            }

            $(boxID + ' .high').html("<b>H/L: </b>" + data.daily[0].temp.max.toFixed(1) + tempUnit + "/" + data.daily[0].temp.min.toFixed(1) + tempUnit);
            $(boxID + ' .wind').html("<b>Wind: </b>" + (data.current.wind_speed * windScale).toFixed(2) + windUnit + " <b class='arrow'>" + getDirection(data.current.wind_deg)) + "</b>";

            if (data.alerts) {
                $(boxID + " .alert-button").show();
                data.alerts.forEach((alert) => {
                    let start = new Date(alert.start * 1000);
                    let end = new Date(alert.end * 1000);
                    $(alertModalID + " .modal-body").append($("<h3>").html(titleCase(alert.event) + " Warning"));
                    $(alertModalID + " .modal-body").append($("<p>").html("Issued: " + alertDateFormatter(start)));
                    $(alertModalID + " .modal-body").append($("<p>").html("Ending: " + alertDateFormatter(end)));
                    $(alertModalID + " .modal-body").append($("<p>").html(alert.description));
                });
            } else {
                $(boxID + " .alert-button").hide();
            }
        });
    });
}

function alertDateFormatter(date) {
    // awful one-liner
    return date.getFullYear() + "-" + ('0' + (date.getMonth() + 1)).slice(-2) + "-" + ('0' + date.getDate()).slice(-2) + " " + ('0' + date.getHours()).slice(-2) + ":" + ('0' + date.getMinutes()).slice(-2) + ":" + ('0' + date.getSeconds()).slice(-2);
}

function getJSON(url, callback) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
        let status = xhr.status;
        if (status === 200) {
            callback(null, xhr.response);
        } else {
            callback(status, xhr.response);
        }
    };
    xhr.send();
}

function getDirection(bearing) {
    let directions = [
        [0, 22.5],
        [22.5, 67.5],
        [67.5, 112.5],
        [112.5, 157.5],
        [157.5, 202.5],
        [202.5, 247.5],
        [247.5, 292.5],
        [292.5, 337.5],
        [337.5, 360]
    ];

    let arrows = ["↓", "↙", "←", "↖", "↑", "↗", "→", "↘", "↓"];
    let x = 0;
    let arrow = "";
    directions.forEach(function(dir) {
        if (bearing >= dir[0] && bearing < dir[1]) {
            // console.log(arrows[x]);
            arrow = arrows[x];
        }
        x++;
    });
    return arrow;
}

function titleCase(str) {
    str = str.toLowerCase().split(' ');
    for (let i = 0; i < str.length; i++) {
        str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
    }
    return str.join(' ');
}

function setIcon(icon, id) {
    switch (icon) {
        case "01d":
            icons.set(id, Skycons.CLEAR_DAY);
            break;
        case "01n":
            icons.set(id, Skycons.CLEAR_NIGHT);
            break;
        case "02d":
            icons.set(id, Skycons.PARTLY_CLOUDY_DAY);
            break;
        case "02n":
            icons.set(id, Skycons.PARTLY_CLOUDY_NIGHT);
            break;
        case "03d":
            icons.set(id, Skycons.CLOUDY);
            break;
        case "03n":
            icons.set(id, Skycons.CLOUDY);
            break;
        case "04d":
            icons.set(id, Skycons.CLOUDY);
            break;
        case "04n":
            icons.set(id, Skycons.CLOUDY);
            break;
        case "09d":
            icons.set(id, Skycons.RAIN);
            break;
        case "09n":
            icons.set(id, Skycons.RAIN);
            break;
        case "10d":
            icons.set(id, Skycons.RAIN);
            break;
        case "10n":
            icons.set(id, Skycons.RAIN);
            break;
        case "11d":
            icons.set(id, Skycons.THUNDER);
            break;
        case "11n":
            icons.set(id, Skycons.THUNDER);
            break;
        case "13d":
            icons.set(id, Skycons.SNOW);
            break;
        case "13n":
            icons.set(id, Skycons.SNOW);
            break;
        case "50d":
            icons.set(id, Skycons.FOG);
            break;
        case "50n":
            icons.set(id, Skycons.FOG);
            break;
        case "w":
            icons.set(id, Skycons.WIND);
            break;
        case "s":
            icons.set(id, Skycons.SLEET);
            break;
        default:
            icons.set(id, Skycons.CLEAR_DAY);
    }
}
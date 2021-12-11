let icons = new Skycons({ "color": "white" });

function getWeatherInfo(code1, code2, units) {
    //TODO: reimplement windy icon based on wind speed
    // Windy threshold has been set as 20mph or ~32km/h

    // ac44343b90759cfe705813ff3a614fa5
    // c974b8da946cbf11c238f30fff7cbbd9

    // console.log("weather!");
    // return;

    // in the event that this thing becomes popular and the api keys become overloaded, just make a bunch more and randomly select one
    let WeatherURL1 = "https://api.openweathermap.org/data/2.5/weather?id=" + code1 + "&appid=ac44343b90759cfe705813ff3a614fa5&units=" + units;
    let WeatherURL2 = "https://api.openweathermap.org/data/2.5/weather?id=" + code2 + "&appid=ac44343b90759cfe705813ff3a614fa5&units=" + units;

    let WeatherURL3;
    let WeatherURL4;

    let tempUnit = "°C";
    let windUnit = "km/h"
    let windScale = 3.6;
    if (units == "imperial") {
        tempUnit = "°F";
        windUnit = "mph";
        windScale = 1;
    }

    $.getJSON(WeatherURL1, function(data) {
        let long = data.coord.lon;
        let lat = data.coord.lat;
        let name = data.name;
        console.log("%cGetting weather for " + name + "...", "color:yellow;font-weight:bold;font-style:italic;");
        $("#weather-name-1").text(name);
        $("#alert-modal-1 .modal-header").text("Alerts for " + name);
        $("#alert-modal-1 .modal-body").empty();

        WeatherURL3 = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "6&appid=c974b8da946cbf11c238f30fff7cbbd9&exclude=minutely,hourly&units=" + units;
        console.log(WeatherURL3);
    }).then(() => {
        $.getJSON(WeatherURL3, function(data) {
            if (data.current.wind_speed > 20) {
                setIcon("w", "weather-icon-1");
                data.current.weather[0].description += " and Windy";
            } else if (data.current.weather[0].description.includes("sleet")) {
                setIcon("s", "weather-icon-1");
            } else {
                setIcon(data.current.weather[0].icon, "weather-icon-1");
            }
            icons.play();
            $('#weather-1 .temperature').html(data.current.temp + tempUnit);
            $('#weather-1 .conditions').html(titleCase(data.current.weather[0].description));
            if (data.current.feels_like) {
                $('#weather-1 .feels-like').html("<b>Feels Like: </b>" + data.current.feels_like.toFixed(1) + tempUnit);
            } else {
                $('#weather-1 .feels-like').remove();
            }

            $('#weather-1 .high').html("<b>H/L: </b>" + data.daily[0].temp.max.toFixed(1) + tempUnit + "/" + data.daily[0].temp.min.toFixed(1) + tempUnit);
            $('#weather-1 .wind').html("<b>Wind: </b>" + (data.current.wind_speed * windScale).toFixed(2) + windUnit + " <b class='arrow'>" + getDirection(data.current.wind_deg)) + "</b>";

            if (data.alerts) {
                $("#alerts-1").show();
                data.alerts.forEach((alert) => {
                    let start = new Date(alert.start * 1000);
                    let end = new Date(alert.end * 1000);
                    $("#alert-modal-1 .modal-body").append($("<h3>").html(titleCase(alert.event) + " Warning"));
                    $("#alert-modal-1 .modal-body").append($("<p>").html("Issued: " + start.getFullYear() + "-" + ('0' + (start.getMonth() + 1)).slice(-2) + "-" + ('0' + start.getDate()).slice(-2) + " " + ('0' + start.getHours()).slice(-2) + ":" + ('0' + start.getMinutes()).slice(-2) + ":" + ('0' + start.getSeconds()).slice(-2)));
                    $("#alert-modal-1 .modal-body").append($("<p>").html("Ending: " + end.getFullYear() + "-" + ('0' + (end.getMonth() + 1)).slice(-2) + "-" + ('0' + end.getDate()).slice(-2) + " " + ('0' + end.getHours()).slice(-2) + ":" + ('0' + end.getMinutes()).slice(-2) + ":" + ('0' + end.getSeconds()).slice(-2)));
                    $("#alert-modal-1 .modal-body").append($("<p>").html(alert.description));
                });
            } else {
                $("#alerts-1").hide();
            }
        });
    });

    $.getJSON(WeatherURL2, function(data) {
        let long = data.coord.lon;
        let lat = data.coord.lat;
        let name = data.name;
        console.log("%cGetting weather for " + name + "...", "color:yellow;font-weight:bold;font-style:italic;");
        $("#weather-name-2").text(name);
        $("#alert-modal-2 .modal-header").text("Alerts for " + name);
        $("#alert-modal-2 .modal-body").empty();

        WeatherURL4 = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "6&appid=c974b8da946cbf11c238f30fff7cbbd9&exclude=minutely,hourly&units=" + units;
        console.log(WeatherURL4);
    }).then(() => {
        $.getJSON(WeatherURL4, function(data) {
            if (data.current.wind_speed > 20) {
                setIcon("w", "weather-icon-2");
                data.current.weather[0].description += " and Windy";
            } else if (data.current.weather[0].description.includes("sleet")) {
                setIcon("s", "weather-icon-2");
            } else {
                setIcon(data.current.weather[0].icon, "weather-icon-2");
            }
            icons.play();
            $('#weather-2 .temperature').html(data.current.temp + tempUnit);
            $('#weather-2 .conditions').html(titleCase(data.current.weather[0].description));
            if (data.current.feels_like) {
                $('#weather-2 .feels-like').html("<b>Feels Like: </b>" + data.current.feels_like.toFixed(1) + tempUnit);
            } else {
                $('#weather-2 .feels-like').remove();
            }

            $('#weather-2 .high').html("<b>H/L: </b>" + data.daily[0].temp.max.toFixed(1) + tempUnit + "/" + data.daily[0].temp.min.toFixed(1) + tempUnit);
            $('#weather-2 .wind').html("<b>Wind: </b>" + (data.current.wind_speed * windScale).toFixed(2) + windUnit + " <b class='arrow'>" + getDirection(data.current.wind_deg)) + "</b>";

            if (data.alerts) {
                $("#alerts-2").show();
                data.alerts.forEach((alert) => {
                    let start = new Date(alert.start * 1000);
                    let end = new Date(alert.end * 1000);
                    $("#alert-modal-2 .modal-body").append($("<h3>").html(titleCase(alert.event) + " Warning"));
                    $("#alert-modal-2 .modal-body").append($("<p>").html("Issued: " + start.getFullYear() + "-" + ('0' + (start.getMonth() + 1)).slice(-2) + "-" + ('0' + start.getDate()).slice(-2) + " " + ('0' + start.getHours()).slice(-2) + ":" + ('0' + start.getMinutes()).slice(-2) + ":" + ('0' + start.getSeconds()).slice(-2)));
                    $("#alert-modal-2 .modal-body").append($("<p>").html("Ending: " + end.getFullYear() + "-" + ('0' + (end.getMonth() + 1)).slice(-2) + "-" + ('0' + end.getDate()).slice(-2) + " " + ('0' + end.getHours()).slice(-2) + ":" + ('0' + end.getMinutes()).slice(-2) + ":" + ('0' + end.getSeconds()).slice(-2)));
                    $("#alert-modal-2 .modal-body").append($("<p>").html(alert.description));
                });
            } else {
                $("#alerts-2").hide();
            }
            setTimeout(function() { icons.color = $('.weather-container').css('color') }, 0);
        });
    });
}

let getJSON = function(url, callback) {
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
};


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

    let arrows = ["↑", "↗", "→", "↘", "↓", "↙", "←", "↖", "↑"];
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
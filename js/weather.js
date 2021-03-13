function getWeather(city1, country1, city2, country2, units) {
    //TODO: reimplement windy icon based on wind speed
    //TODO: add custom icons?
    //TODO: weather alerts
    //TODO: turn switch into function
    //TODO: make someone post this on r/badcode


    // in the event that this thing becomes popular and the api keys become overloaded, just make a bunch more and randomly select one
    var WeatherURL1 = "https://api.openweathermap.org/data/2.5/weather?q=" + city1 + "," + country1 + "&appid=ac44343b90759cfe705813ff3a614fa5&units=" + units;
    var WeatherURL2 = "https://api.openweathermap.org/data/2.5/weather?q=" + city2 + "," + country2 + "&appid=c974b8da946cbf11c238f30fff7cbbd9&units=" + units;

    var WeatherURL3;
    var WeatherURL4;

    var tempUnit = "°C";
    var windUnit = "km/h"
    var windScale = 3.6;
    if (units == "imperial") {
        tempUnit = "°F";
        windUnit = "mph";
        windScale = 1;
    }
    //Set names
    $("#weathername-1").text(city1);
    $("#weathername-2").text(city2);
    $("#alert-head-1").text("Alerts for " + city1);
    $("#alert-head-2").text("Alerts for " + city2);
    $("#alert-body-1").empty();
    $("#alert-body-2").empty();

    $.getJSON(WeatherURL1, function(data) {
        console.log("%cGetting weather for " + city1 + "...", "color:yellow;font-weight:bold;font-style:italic;");
        var long = data.coord.lon;
        var lat = data.coord.lat;
        WeatherURL3 = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "6&appid=ac44343b90759cfe705813ff3a614fa5&exclude=minutely,hourly&units=" + units;
        console.log(WeatherURL3);
    }).then(() => {
        $.getJSON(WeatherURL3, function(data) {
            var icons = new Skycons({ "color": $('.button').css('color') });
            switch (data.current.weather[0].icon) {
                case "01d":
                    icons.set('weathericon-1', Skycons.CLEAR_DAY);
                    break;
                case "01n":
                    icons.set('weathericon-1', Skycons.CLEAR_NIGHT);
                    break;
                case "02d":
                    icons.set('weathericon-1', Skycons.PARTLY_CLOUDY_DAY);
                    break;
                case "02n":
                    icons.set('weathericon-1', Skycons.PARTLY_CLOUDY_NIGHT);
                    break;
                case "03d":
                    icons.set('weathericon-1', Skycons.CLOUDY);
                    break;
                case "03n":
                    icons.set('weathericon-1', Skycons.CLOUDY);
                    break;
                case "04d":
                    icons.set('weathericon-1', Skycons.CLOUDY);
                    break;
                case "04n":
                    icons.set('weathericon-1', Skycons.CLOUDY);
                    break;
                case "09d":
                    icons.set('weathericon-1', Skycons.RAIN);
                    break;
                case "09n":
                    icons.set('weathericon-1', Skycons.RAIN);
                    break;
                case "10d":
                    icons.set('weathericon-1', Skycons.RAIN);
                    break;
                case "10n":
                    icons.set('weathericon-1', Skycons.RAIN);
                    break;
                case "11d":
                    icons.set('weathericon-1', Skycons.RAIN);
                    break;
                case "11n":
                    icons.set('weathericon-1', Skycons.RAIN);
                    break;
                case "13d":
                    icons.set('weathericon-1', Skycons.SNOW);
                    break;
                case "13n":
                    icons.set('weathericon-1', Skycons.SNOW);
                    break;
                case "50d":
                    icons.set('weathericon-1', Skycons.FOG);
                    break;
                case "50n":
                    icons.set('weathericon-1', Skycons.FOG);
                    break;

                default:

            }
            icons.play();
            $('#weather-1 #temperature').html(data.current.temp + tempUnit);
            $('#weather-1 #conditions').html(titleCase(data.current.weather[0].description));
            if (data.current.feels_like) {
                $('#weather-1 #feels-like').html("<b>Feels Like: </b>" + data.current.feels_like.toFixed(1) + tempUnit);
            } else {
                $('#weather-1 #feels-like').remove();
            }

            $('#weather-1 #high').html("<b>H/L: </b>" + data.daily[0].temp.max.toFixed(1) + tempUnit + "/" + data.daily[0].temp.min.toFixed(1) + tempUnit);
            $('#weather-1 #wind').html("<b>Wind: </b>" + (data.current.wind_speed * windScale).toFixed(2) + windUnit + " <b class='arrow'>" + getDirection(data.current.wind_deg)) + "</b>";

            if (data.alerts) {
                $("#alerts-1").show();
                data.alerts.forEach((alert) => {
                    var start = new Date(alert.start * 1000);
                    var end = new Date(alert.end * 1000);
                    $("#alert-body-2").append($("<h3>").html(titleCase(alert.event) + " Warning"));
                    $("#alert-body-2").append($("<p>").html("Issued: " + start.getFullYear() + "-" + ('0' + (start.getMonth() + 1)).slice(-2) + "-" + ('0' + start.getDate()).slice(-2) + " " + ('0' + start.getHours()).slice(-2) + ":" + ('0' + start.getMinutes()).slice(-2) + ":" + ('0' + start.getSeconds()).slice(-2)));
                    $("#alert-body-2").append($("<p>").html("Ending: " + end.getFullYear() + "-" + ('0' + (end.getMonth() + 1)).slice(-2) + "-" + ('0' + end.getDate()).slice(-2) + " " + ('0' + end.getHours()).slice(-2) + ":" + ('0' + end.getMinutes()).slice(-2) + ":" + ('0' + end.getSeconds()).slice(-2)));
                    $("#alert-body-2").append($("<p>").html(alert.description));
                });
            } else {
                $("#alerts-1").hide();
            }
        });
    });

    $.getJSON(WeatherURL2, function(data) {
        console.log("%cGetting weather for " + city2 + "...", "color:yellow;font-weight:bold;font-style:italic;");
        var long = data.coord.lon;
        var lat = data.coord.lat;
        WeatherURL4 = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "6&appid=c974b8da946cbf11c238f30fff7cbbd9&exclude=minutely,hourly&units=" + units;
        console.log(WeatherURL4);
    }).then(() => {
        $.getJSON(WeatherURL4, function(data) {
            var icons = new Skycons({ "color": $('.button').css('color') });
            switch (data.current.weather[0].icon) {
                case "01d":
                    icons.set('weathericon-2', Skycons.CLEAR_DAY);
                    break;
                case "01n":
                    icons.set('weathericon-2', Skycons.CLEAR_NIGHT);
                    break;
                case "02d":
                    icons.set('weathericon-2', Skycons.PARTLY_CLOUDY_DAY);
                    break;
                case "02n":
                    icons.set('weathericon-2', Skycons.PARTLY_CLOUDY_NIGHT);
                    break;
                case "03d":
                    icons.set('weathericon-2', Skycons.CLOUDY);
                    break;
                case "03n":
                    icons.set('weathericon-2', Skycons.CLOUDY);
                    break;
                case "04d":
                    icons.set('weathericon-2', Skycons.CLOUDY);
                    break;
                case "04n":
                    icons.set('weathericon-2', Skycons.CLOUDY);
                    break;
                case "09d":
                    icons.set('weathericon-2', Skycons.RAIN);
                    break;
                case "09n":
                    icons.set('weathericon-2', Skycons.RAIN);
                    break;
                case "10d":
                    icons.set('weathericon-2', Skycons.RAIN);
                    break;
                case "10n":
                    icons.set('weathericon-2', Skycons.RAIN);
                    break;
                case "11d":
                    icons.set('weathericon-2', Skycons.RAIN);
                    break;
                case "11n":
                    icons.set('weathericon-2', Skycons.RAIN);
                    break;
                case "13d":
                    icons.set('weathericon-2', Skycons.SNOW);
                    break;
                case "13n":
                    icons.set('weathericon-2', Skycons.SNOW);
                    break;
                case "50d":
                    icons.set('weathericon-2', Skycons.FOG);
                    break;
                case "50n":
                    icons.set('weathericon-2', Skycons.FOG);
                    break;

                default:

            }
            icons.play();
            $('#weather-2 #temperature').html(data.current.temp + tempUnit);
            $('#weather-2 #conditions').html(titleCase(data.current.weather[0].description));
            if (data.current.feels_like) {
                $('#weather-2 #feels-like').html("<b>Feels Like: </b>" + data.current.feels_like.toFixed(1) + tempUnit);
            } else {
                $('#weather-2 #feels-like').remove();
            }

            $('#weather-2 #high').html("<b>H/L: </b>" + data.daily[0].temp.max.toFixed(1) + tempUnit + "/" + data.daily[0].temp.min.toFixed(1) + tempUnit);
            $('#weather-2 #wind').html("<b>Wind: </b>" + (data.current.wind_speed * windScale).toFixed(2) + windUnit + " <b class='arrow'>" + getDirection(data.current.wind_deg)) + "</b>";

            if (data.alerts) {
                $("#alerts-2").show();
                data.alerts.forEach((alert) => {
                    var start = new Date(alert.start * 1000);
                    var end = new Date(alert.end * 1000);
                    $("#alert-body-2").append($("<h3>").html(titleCase(alert.event) + " Warning"));
                    $("#alert-body-2").append($("<p>").html("Issued: " + start.getFullYear() + "-" + ('0' + (start.getMonth() + 1)).slice(-2) + "-" + ('0' + start.getDate()).slice(-2) + " " + ('0' + start.getHours()).slice(-2) + ":" + ('0' + start.getMinutes()).slice(-2) + ":" + ('0' + start.getSeconds()).slice(-2)));
                    $("#alert-body-2").append($("<p>").html("Ending: " + end.getFullYear() + "-" + ('0' + (end.getMonth() + 1)).slice(-2) + "-" + ('0' + end.getDate()).slice(-2) + " " + ('0' + end.getHours()).slice(-2) + ":" + ('0' + end.getMinutes()).slice(-2) + ":" + ('0' + end.getSeconds()).slice(-2)));
                    $("#alert-body-2").append($("<p>").html(alert.description));
                });
            } else {
                $("#alerts-2").hide();
            }
        });
    });
}

var getJSON = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
        var status = xhr.status;
        if (status === 200) {
            callback(null, xhr.response);
        } else {
            callback(status, xhr.response);
        }
    };
    xhr.send();
};


function getDirection(bearing) {
    var directions = [
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

    var arrows = ["↓", "↙", "←", "↖", "↑", "↗", "→", "↘", "↓"];
    var x = 0;
    var arrow = "";
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
    for (var i = 0; i < str.length; i++) {
        str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
    }
    return str.join(' ');
}
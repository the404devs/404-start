$(function() {
    /* Adjust these two urls to suit the location of your choice
    Easiest way is to just adjust the coordinates in the urls (43.9713,-79.2468), etc
    darksky.net
    
    DarkSky was also bought out by Apple recently, so their api will stop working come 2021.
    Hopefully a suitable alternative appears before then.*/
    var URL1 = "https://api.darksky.net/forecast/85ee59f33b71d050c766551ca2d2f139/43.9713,-79.2468?callback=?&units=ca";
    var URL2 = "https://api.darksky.net/forecast/85ee59f33b71d050c766551ca2d2f139/43.654,-79.3872?callback=?&units=ca";
    //Set the names of your locations here. Match name1 with URL1, and so on.
    var name1 = "Stouffville";
    var name2 = "Toronto";

    //openweather api ac44343b90759cfe705813ff3a614fa5 85ee59f33b71d050c766551ca2d2f139 http://api.openweathermap.org/data/2.5/weather?q=Stouffville&appid=ac44343b90759cfe705813ff3a614fa5

    //Set names
    $("#weathername-1").html(name1);
    $("#weathername-2").html(name2);

    $.getJSON(URL1, function(data) {
        var icons = new Skycons({ "color": $('.button').css('color') });
        icons.set('weathericon-1', data.currently.icon);
        icons.play();
        $('#weather-1 #temperature').html(data.currently.temperature + "°C");
        $('#weather-1 #conditions').html(data.currently.summary);
        if (data.currently.apparentTemperature) {
            $('#weather-1 #feels-like').html("<b>Feels Like: </b>" + data.currently.apparentTemperature.toFixed(1) + "°C");
        } else {
            $('#weather-1 #feels-like').remove();
        }
        if (!data.alerts)
            $("#alerts-1").remove();
        else {
            for (var i = data.alerts.length - 1; i >= 0; i--) {
                $("#alert-body-1").append($("<span/>").addClass("alert-title").html(data.alerts[i].title)).append($("<br/>")).append($("<br/>"));
                $("#alert-body-1").append($("<span/>").addClass("alert-body").html(data.alerts[i].description)).append($("<br/>")).append($("<br/>"));
                if (i != 0) { $("#alert-body-1").append($("<hr>")) }
            }
        }
        $('#weather-1 #high').html("<b>H/L: </b>" + data.daily.data[0].temperatureHigh.toFixed(1) + "°C/" + data.daily.data[0].temperatureLow.toFixed(1) + "°C");
        $('#weather-1 #wind').html("<b>Wind: </b>" + data.currently.windSpeed + "km/h <b class='arrow'>" + getDirection(data.currently.windBearing)) + "</b>";
    });
    $.getJSON(URL2, function(data) {
        var icons = new Skycons({ "color": $('.button').css('color') });
        icons.set('weathericon-2', data.currently.icon);
        icons.play();
        $('#weather-2 #temperature').html(data.currently.temperature + "°C");
        $('#weather-2 #conditions').html(data.currently.summary);
        if (data.currently.apparentTemperature) {
            $('#weather-2 #feels-like').html("<b>Feels Like: </b>" + data.currently.apparentTemperature.toFixed(1) + "°C");
        } else {
            $('#weather-2 #feels-like').remove();
        }
        if (!data.alerts)
            $("#alerts-2").remove();
        else {
            for (var i = data.alerts.length - 1; i >= 0; i--) {
                $("#alert-body-2").append($("<span/>").addClass("alert-title").html(data.alerts[i].title)).append($("<br/>")).append($("<br/>"));
                $("#alert-body-2").append($("<span/>").addClass("alert-body").html(data.alerts[i].description)).append($("<br/>")).append($("<br/>"));
                if (i != 0) { $("#alert-body-tor").append($("<hr>")) }
            }
        }
        $('#weather-2 #high').html("<b>H/L: </b>" + data.daily.data[0].temperatureHigh.toFixed(1) + "°C/" + data.daily.data[0].temperatureLow.toFixed(1) + "°C");
        $('#weather-2 #wind').html("<b>Wind: </b>" + data.currently.windSpeed + "km/h <b class='arrow'>" + getDirection(data.currently.windBearing)) + "</b>";
    });
});

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
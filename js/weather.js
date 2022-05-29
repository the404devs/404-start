const icons = new Skycons({ "color": "white" });
const apiKeys = ["ac44343b90759cfe705813ff3a614fa5", "c974b8da946cbf11c238f30fff7cbbd9"];
// We dual-wield API keys, so we don't overload a single one. I'm a cheap bastard, what can I say?
// If they start hitting limits, I'll just add more keys, lol.

// Initial weather-getting function.
function getWeatherInfo(code1, code2, units) {
    // return; //for debugging
    // Construct the initial URLs for the first API calls.
    const weatherURL1 = "https://api.openweathermap.org/data/2.5/weather?id=" + code1 + "&appid=" + apiKeys[0] + "&units=" + units;
    const weatherURL2 = "https://api.openweathermap.org/data/2.5/weather?id=" + code2 + "&appid=" + apiKeys[1] + "&units=" + units;
    // Grab weather data for the two cities.
    // Comment out the following two lines to disable weather info (for debugging).
    getOpenWeatherData(weatherURL1, "#weather-1", units);
    getOpenWeatherData(weatherURL2, "#weather-2", units);
}

// Makes the API calls and populates the weather info.
function getOpenWeatherData(URL, boxID, units) {
    let oneCallURL = ""; // Will be used once we construct the URL for our second API call.
    let tempUnit = "°C"; // Temperature defaults to Celsius.
    let windUnit = "km/h" // Wind defaults to kilometers per hour.
    let windScale = 3.6; // OpenWeather gives wind speeds in metres per second, this is our multiplier to convert to km/h.
    const alertModalID = boxID.replace('weather', 'alert-modal'); // We will need the ID of the alert modal for each weather box.
    const iconID = boxID.replace('weather', 'weather-icon'); // We will need the ID of the weather icon for each weather box.
    if (units == "imperial") {
        // If the user has selected imperial units, we need to convert the temperature and wind speeds to imperial units.
        tempUnit = "°F";
        windUnit = "mph";
        windScale = 2.236936; // Change the wind speed multiplier to miles per hour (2.236936m/s == 1mph).
    }
    $.getJSON(URL, function(data) {
        // Yes, we call one API to get the lat/long of the city, and use that to call another API.
        // Yes, its stupid as hell, but it works.
        // Why have I brought this madness upon myself?
        // Well, the OneCall API provides more detailed weather info, and is pretty much on-par with the old DarkSky API this used in the past.
        // However, it can only be called with a latitude and longitude, and I doubt the user knows the lat/long of their city offhand.
        // So, we call OpenWeather's basic weather API with a more easy-to-find city ID, and use the lat/long returned to call the OneCall API.
        // I was very content with DarkSky, but Apple insists on making me miserable.
        // I find it vaguely ironic that OpenWeather calls their DarkSky-equivalent API "OneCall", when this is the pain I have to endure.

        // From our first call to OpenWeather, we will get the lat/long of the city, as well as it's name.
        const long = data.coord.lon;
        const lat = data.coord.lat;
        const name = data.name;

        console.log("%cGetting weather for " + name + "...", "color:yellow;font-weight:bold;font-style:italic;");
        // Fill in the city name in the weather box.
        $(boxID + ' .weather-name').text(name);
        // Reset the alert modals to their default state.
        $(alertModalID + " .modal-header").text("Alerts for " + name);
        $(alertModalID + " .modal-body").empty();

        // Figure out which API key to use, the boxes use different ones to circumvent API key limits.
        let apiKey = "";
        if (boxID == "#weather-1") {
            apiKey = apiKeys[0];
        } else if (boxID == "#weather-2") {
            apiKey = apiKeys[1];
        }
        // Finally, construct the URL for the second API call.
        oneCallURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "6&appid=" + apiKey + "&exclude=minutely,hourly&units=" + units;
        // console.log("%cCalling " + oneCallURL + "...", "color:yellow;font-weight:bold;font-style:italic;");
    }).then(() => {
        // Make the second API call once the first wave of nonsense has finished.
        $.getJSON(oneCallURL, function(data) {
            // Hacky workarounds for wind and sleet conditions
            if (data.current.wind_speed > 8) {
                // If the wind speed is greater than ~30km/h, set the icon to the windy one.
                setIcon("w", iconID);
                data.current.weather[0].description += " & Windy"; // Append "Windy" to the weather description.
            } else if (data.current.weather[0].description.includes("sleet")) {
                setIcon("s", iconID); // If the description contains "sleet", use the sleet icon
            } else {
                setIcon(data.current.weather[0].icon, iconID); //Set the icon to the one matching the current conditions.
            }
            icons.play(); // Begin the animation.

            $(boxID + ' .temperature').html(data.current.temp + tempUnit); // Fill in the temperature.
            $(boxID + ' .conditions').html(titleCase(data.current.weather[0].description)); // Fill in the conditions.
            // Check for a "feels like" value (humidex, wind chill, etc), and fill it in if it exists.
            if (data.current.feels_like) {
                $(boxID + ' .feels-like').html("<b>Feels Like: </b>" + data.current.feels_like.toFixed(1) + tempUnit);
            } else {
                $(boxID + ' .feels-like').remove();
            }

            $(boxID + ' .high').html("<b>H/L: </b>" + data.daily[0].temp.max.toFixed(1) + tempUnit + "/" + data.daily[0].temp.min.toFixed(1) + tempUnit); // Fill in the high/low.
            $(boxID + ' .wind').html("<b>Wind: </b>" + (data.current.wind_speed * windScale).toFixed(2) + windUnit + " <b class='arrow'>" + getDirection(data.current.wind_deg)) + "</b>"; // Fill in the wind speed and direction.

            // Check for any alerts for the city.
            if (data.alerts) {
                // Show the ! button that indicates there are alerts.
                $(boxID + " .alert-button").show();
                data.alerts.forEach((alert) => {
                    // For each alert, add it to the alert modal.
                    let start = new Date(alert.start * 1000);
                    let end = new Date(alert.end * 1000);
                    $(alertModalID + " .modal-body").append($("<h3>").html(titleCase(alert.event) + " Warning"));
                    $(alertModalID + " .modal-body").append($("<p>").html("Issued: " + alertDateFormatter(start)));
                    $(alertModalID + " .modal-body").append($("<p>").html("Ending: " + alertDateFormatter(end)));
                    $(alertModalID + " .modal-body").append($("<p>").html(alert.description));
                });
            } else {
                // If there are no alerts, hide the ! button.
                $(boxID + " .alert-button").hide();
            }
        });
    });
}

// Used to run GET requests to the OpenWeather API.
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

// Takes the current wind bearing (in degrees) and returns an appropriate arrow.
function getDirection(bearing) {
    const directions = [
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
    const arrows = ["↓", "↙", "←", "↖", "↑", "↗", "→", "↘", "↓"];
    let x = 0;
    let arrow = "";
    directions.forEach(function(dir) {
        if (bearing >= dir[0] && bearing < dir[1]) {
            arrow = arrows[x];
        }
        x++;
    });
    return arrow;
}

// Capitalizes the first letter of each word in a string.
function titleCase(str) {
    str = str.toLowerCase().split(' ');
    for (let i = 0; i < str.length; i++) {
        str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
    }
    return str.join(' ');
}

// Used to determine the icon to use for the current conditions.
function setIcon(icon, id) {
    id = id.substring(1); // Remove the # from the ID.
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

function alertDateFormatter(d) {
    // awful one-liner of sadness and misery.
    return d.getFullYear() + "-" + ('0' + (d.getMonth() + 1)).slice(-2) + "-" + ('0' + d.getDate()).slice(-2) + " " + ('0' + d.getHours()).slice(-2) + ":" + ('0' + d.getMinutes()).slice(-2) + ":" + ('0' + d.getSeconds()).slice(-2);
}
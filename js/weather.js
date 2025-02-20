const icons = new Skycons({ "color": "white" });
const apiKeys = ["ac44343b90759cfe705813ff3a614fa5", "c974b8da946cbf11c238f30fff7cbbd9"];
// We dual-wield API keys, so we don't overload a single one. I'm a cheap bastard, what can I say?
// If they start hitting limits, I'll just add more keys, lol.

// Initial weather-getting function.
function getWeatherInfo(place1, place2, units) {
    // return; //for debugging
    // Construct the initial URLs for the first API calls.
    const weatherURL1 = "https://api.openweathermap.org/data/2.5/weather?id=" + place1 + "&appid=" + apiKeys[0] + "&units=" + units;
    const weatherURL2 = "https://api.openweathermap.org/data/2.5/weather?id=" + place2 + "&appid=" + apiKeys[1] + "&units=" + units;
    // Grab weather data for the two cities.
    // Comment out the following two lines to disable weather info (for debugging).
    getOpenWeatherData(weatherURL1, "#weather-1", units);
    getOpenWeatherData(weatherURL2, "#weather-2", units);

    // getWttrWeatherData(place1, "#weather-1", units);
    // getWttrWeatherData(place2, "#weather-2", units);

    // console.log(weatherURL1);
    // console.log(weatherURL2);
}


function getWttrWeatherData(location, boxID, units) {
    const baseURL = "https://wttr.in/";
    const requestFormat = {
        "location": "%l",
        "condition": "%C",
        "icon": "%c",
        "temperature": "%t",
        "feels_like": "%f",
        "wind": "%w",
        "time": "%T"
    }

    const unitCode = units == 'metric' ? 'm' : 'u';

    const requestURL = `${baseURL}${location.replaceAll(" ", "+")}?${unitCode}&format=${JSON.stringify(requestFormat).replaceAll('\"', '%22')}`;

    console.log("%cCalling " + requestURL + "...", "color:yellow;font-weight:bold;font-style:italic;");


    fetch(requestURL).then((response) => {return response.text()}).then(data => {
        const weatherData = JSON.parse(data);
        console.log(weatherData);

        const iconID = boxID.replace('weather', 'weather-icon'); // We will need the ID of the weather icon for each weather box.
        $(boxID + ' .weather-name').text(weatherData.location);
        //todo: if wind +30kmh, add windy to desc

        $(boxID + ' .temperature').html(weatherData.temperature.replaceAll('+', '')); // Fill in the temperature.
        $(boxID + ' .feels-like').html("<b>Feels Like: </b>" + weatherData.feels_like.replaceAll('+', ''));
        $(boxID + ' .conditions').html(weatherData.condition); // Fill in the conditions.
        
        const wind_speed = weatherData.wind.substring(1);
        const wind_dir = weatherData.wind.substring(0,1);
        
        $(boxID + ' .wind').html(`<b>Wind: </b>${wind_speed} <b class='arrow'>${wind_dir}</b>`); // Fill in the wind speed and direction.
        $(boxID + " .alert-button").hide();

        // TODO: Nighttime icons
        // if (weatherData.icon == "☀️")

        setIcon(weatherData.icon, iconID);
        icons.play();


    });
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
        console.log("%cGetting weather for " + data.name + "...", "color:yellow;font-weight:bold;font-style:italic;");
        console.log(data)
        // Fill in the city name in the weather box.
        $(boxID + ' .weather-name').text(data.name);
        // Reset the alert modals to their default state.
        $(alertModalID + " .modal-header").text("Alerts for " + data.name);
        $(alertModalID + " .modal-body").empty();

        $(`${boxID} .temperature`).html(data.main.temp + tempUnit);
        $(`${boxID} .conditions`).html(titleCase(data.weather[0].description));
        $(`${boxID} .wind`).html("<b>Wind: </b>" + (data.wind.speed * windScale).toFixed(2) + windUnit + " <b class='arrow'>" + getDirection(data.wind.deg)+ "</b>");
        $(`${boxID} .high`).html("<b>H/L: </b>" + data.main.temp_max.toFixed(1) + tempUnit + "/" + data.main.temp_min.toFixed(1) + tempUnit);

        if (data.main.feels_like) {
            $(`${boxID} .feels-like`).html("<b>Feels Like: </b>" + data.main.feels_like.toFixed(1) + tempUnit);
        }

        //TODO: Figure out if I can get alerts.
        $(boxID + " .alert-button").hide();

        setIcon(data.weather[0].icon, iconID);
        icons.play();
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



        case "☁️":
            icons.set(id, Skycons.CLOUDY);
            break;
        case "🌧":
            icons.set(id, Skycons.RAIN);
            break;
        case "❄️":
            icons.set(id, Skycons.SNOW);
            break;
        case "🌨":
            icons.set(id, Skycons.SNOW);
            break;
        case "🌫":
            icons.set(id, Skycons.FOG);
            break;
        case "🌦":
            icons.set(id, Skycons.RAIN);
            break;
        case "⛅️":
            icons.set(id, Skycons.PARTLY_CLOUDY_DAY);
            break;
        case "☀️":
            icons.set(id, Skycons.CLEAR_DAY);
            break;
        case "🌩":
            icons.set(id, Skycons.THUNDER);
            break;
        case "⛈":
            icons.set(id, Skycons.THUNDER);
            break;
        default:
            icons.set(id, Skycons.CLEAR_DAY);
    }
}

function alertDateFormatter(d) {
    // awful one-liner of sadness and misery.
    return d.getFullYear() + "-" + ('0' + (d.getMonth() + 1)).slice(-2) + "-" + ('0' + d.getDate()).slice(-2) + " " + ('0' + d.getHours()).slice(-2) + ":" + ('0' + d.getMinutes()).slice(-2) + ":" + ('0' + d.getSeconds()).slice(-2);
}
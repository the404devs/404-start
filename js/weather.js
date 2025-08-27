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

    const weatherBox1 = $("#weather-1");
    const weatherBox2 = $("#weather-2");
    // Grab weather data for the two cities.
    // Comment out the following two lines to disable weather info (for debugging).
    getOpenWeatherData(weatherURL1, weatherBox1, units);
    getOpenWeatherData(weatherURL2, weatherBox2, units);
}

// Makes the API calls and populates the weather info.
function getOpenWeatherData(URL, container, units) {
    const temp = container.querySelector(".temperature");
    const city = container.querySelector(".weather-name");
    const cond = container.querySelector(".conditions");
    const wind = container.querySelector(".wind");
    const high = container.querySelector(".high");
    const feel = container.querySelector(".feels-like");
    const icon = container.querySelector(".weather-icon");
    const alert_button = container.querySelector(".alert-button");

    let tempUnit = "°C"; // Temperature defaults to Celsius.
    let windUnit = "km/h" // Wind defaults to kilometers per hour.
    let windScale = 3.6; // OpenWeather gives wind speeds in metres per second, this is our multiplier to convert to km/h.

    if (units == "imperial") {
        // If the user has selected imperial units, we need to convert the temperature and wind speeds to imperial units.
        tempUnit = "°F";
        windUnit = "mph";
        windScale = 2.236936; // Change the wind speed multiplier to miles per hour (2.236936m/s == 1mph).
    }

    fetch(URL).then(response => { 
        return response.json() ;
    }).then(data => {
            console.log("%cGetting weather for " + data.name + "...", "color:yellow;font-weight:bold;font-style:italic;");
            console.log(data);
            temp.textContent = data.main.temp + tempUnit;
            city.textContent = data.name;
            cond.textContent = titleCase(data.weather[0].description);
            wind.innerHTML = "<b>Wind: </b>" + (data.wind.speed * windScale).toFixed(2) + windUnit + " <b class='arrow'>" + getDirection(data.wind.deg) + "</b>";
            high.innerHTML = "<b>H/L: </b>" + data.main.temp_max.toFixed(1) + tempUnit + "/" + data.main.temp_min.toFixed(1) + tempUnit;
            if (data.main.feels_like) {
                feel.innerHTML = "<b>Feels Like: </b>" + data.main.feels_like.toFixed(1) + tempUnit;
            }
            setIcon(data.weather[0].icon, icon);
            icons.play();
            alert_button.style.display = "none";
        }
    );
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
        if (bearing >= dir[0] && bearing <= dir[1]) {
            arrow = arrows[x];
        }
        x++;
    });
    return arrow;
}

// Capitalizes the first letter of each word in a string.
function titleCase(str) {
    const dontCapitalize = ["and"];
    str = str.toLowerCase().split(' ');
    for (let i = 0; i < str.length; i++) {
        if (!dontCapitalize.includes(str[i])) {
            str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
        }
    }
    return str.join(' ');
}

// Used to determine the icon to use for the current conditions.
function setIcon(code, id) {
    // id = id.substring(1); // Remove the # from the ID.
    switch (code) {
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

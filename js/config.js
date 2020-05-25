var config = {
    "Pywal": "file:///home/the404/.cache/wal/colors.css",
    "WeatherURL1": "https://api.darksky.net/forecast/85ee59f33b71d050c766551ca2d2f139/43.9713,-79.2468?callback=?&units=ca",
    "WeatherName1": "Stouffville",
    "WeatherURL2": "https://api.darksky.net/forecast/85ee59f33b71d050c766551ca2d2f139/43.654,-79.3872?callback=?&units=ca",
    "WeatherName2": "Toronto",
    "ExtPath": "file:///home/the404/homepage/index.html"
};

var fire_config = {
    apiKey: "AIzaSyBP6KLfzsYrYfMb66aQKjPaupm_JJT2uHI",
    authDomain: "homepage-events.firebaseapp.com",
    databaseURL: "https://homepage-events.firebaseio.com",
    projectId: "homepage-events",
    storageBucket: "",
    messagingSenderId: "111058101137"
};

/* DO NOT MODIFY ANYTHING BEYOND THIS POINT */
$('head').append('<link rel="stylesheet" type="text/css" href=' + config.Pywal + '>');
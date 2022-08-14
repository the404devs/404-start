const dataVersion = 3; // Current theme data version
const minimumSupportedDataVersion = 0; // Minimum supported data version, used to determine if an imported theme is compatible with the current version
let base64String = ""; // Will hold the base64 string of an uploaded image
// All theme keys representing the background colour of various elements
const backgroundKeys = ["background", "weatherBoxBackground", "modalBackground", "linkBoxBackground", "buttonBackground", "headerBackground"];
let unsavedChanges = false; // Used to determine if the user has made any unsaved changes.

const defaults = {
    "weather": {
        "code1": 6167865,
        "code2": 6077243,
        "units": "metric",
        "autoRefresh": false
    },
    "search": {
        "show": true,
        "engine": "duckduckgo",
        "focus": true
    },
    "links": {
        "show": false,
        "link1": {
            "name": "",
            "url": "",
        },
        "link2": {
            "name": "",
            "url": "",
        },
        "link3": {
            "name": "",
            "url": "",
        },
        "link4": {
            "name": "",
            "url": "",
        },
        "link5": {
            "name": "",
            "url": "",
        },
        "link6": {
            "name": "",
            "url": "",
        },
    },
    "misc": {
        "updateCheck": false,
        "showXKCD": false,
        "invertXKCD": false,
        "dateFormat": "%W, %MMMM %d, %Y",
        "timeFormat": "%hh:%m:%s %a",
        "useCustomPositioning": false
    },
    "customLayout": {
        "weather1": {
            "x": "20%",
            "y": "150px"
        },
        "weather2": {
            "x": "70%",
            "y": "150px"
        },
        "search": {
            "x": "40%",
            "y": "400px"
        },
        "link": {
            "x": "45%",
            "y": "450px"
        },
        "xkcd": {
            "x": "45%",
            "y": "500px"
        }
    },
};

// Used to save current configuration to local storage.
function saveToLS(reload) {
    // In some situations we don't want to reload the config, so that's what the reload parameter is for.
    console.log("%cSaving user config...", "color:lightblue");
    const userCSS = constructUserCSS(); // Construct the user CSS from all the current theme values.
    // Construct a JSON object containing all the current config values.
    const data = {
        "theme": {
            "colours": userCSS
        },
        "weather": {
            "code1": $("#weather-code-1").val(),
            "code2": $("#weather-code-2").val(),
            "units": $("#unit-selector").val(),
            "autoRefresh": $("#weather-auto-refresh").prop("checked")
        },
        "search": {
            "engine": $("#search-engine-selector").val(),
            "show": $("#show-search-bar").prop("checked"),
            "focus": $("#focus-search-bar").prop("checked")
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
            "timeFormat": $("#time-format").val(),
            "useCustomPositioning": $("#custom-position-toggle").prop("checked")
        },
        "customLayout": currentCustomLayout,
        "version": dataVersion
    };

    let success = false;
    try {
        // Attempt to stringify the JSON object, and save it to local storage.
        localStorage.setItem("404CONFIG", JSON.stringify(data));
        success = true;
    } catch (DOMException) {
        // Local storage can only hold so much data, so if it fails the culprit is usually the user attempting to set a particularly large image as the background.
        // Other things can probably make it fail, but if I haven't encountered them they don't exist.
        console.log("%c" + "Image too big!", "color:red");
        console.log("%c" + "DOMException: " + DOMException, "color:red");
        alert("Image too big!\n\nPlease select a smaller image.\nThe max size is ~3MB.");
    }

    if (success) {
        // If the save was successful, hide the config modal, and reload if necessary.
        console.log("%c" + "Saved!", "color:lightgreen");
        unsavedChanges = false;
        $("#unsaved-indicator").hide();
        if (reload) {
            loadFromLS();
        }
        hideModal();
    }
};

// Used to load the current config from local storage.
function loadFromLS() {
    console.log("%c" + "Loading config...", "color:lightblue");
    let data = JSON.parse(localStorage.getItem("404CONFIG")); // Grab the config from local storage.
    // In some situations we will want to save immediately after loading, so this variable is used to determine if we should save.
    // Example: no config is found in local storage, so we want to save the default config.
    let saveAfterLoad = false;

    // Check if local storage came back empty.
    if (!data) {
        console.log("%cNo config found, setting defaults.", "color:red");
        // Fill the theme config section with the default values.
        $(".theme-val").each(function() {
            $(this).val(styleVar($(this).attr("id")));
        });
        saveAfterLoad = true; // Indicate that we should save after loading.
        saveToLS(false); // Save without reloading to set the default CSS values, we will save properly later.
        data = JSON.parse(localStorage.getItem("404CONFIG")); // Grab config again, with the default CSS now in place.
    }

    // Remove any existing style tags, such as ones containing the old CSS after the user makes a change to the theme.
    $("head").children("#USER-STYLE").each(function() {
        $(this).remove();
    });
    // Pop in a new style tag with the current theme CSS.
    $("head").append($("<style>").attr("id", "USER-STYLE").html(data.theme.colours));

    // Fill all the theme config inputs (colours, etc) with the values of the current theme.
    $(".theme-val").each(function() {
        $(this).val(styleVar($(this).attr("id")));
    });

    fillMissingValues(data); // Fill in any missing values in the config.

    // Set the indicator labels for the slider-based inputs.
    $('#boxAlphaVal').html(($('#boxAlpha').val() * 100).toFixed(0) + '%');
    $('#headerAlphaVal').html(($('#headerAlpha').val() * 100).toFixed(0) + '%');
    $('#borderRadiusVal').html($('#borderRadius').val() + 'px');
    $('#weatherBoxMarginVal').html($('#weatherBoxMargin').val() + '%');

    // Fill the weather configuration keys with what's in local storage, or the default if unavailable.
    $("#weather-code-1").val(data.weather.code1);
    $("#weather-code-2").val(data.weather.code2);
    $("#unit-selector").val(data.weather.units);
    $("#weather-auto-refresh").prop("checked", data.weather.autoRefresh);

    // Fill the search engine selector with the current value, or the default if unavailable.
    $("#search-engine-selector").val(data.search.engine);
    // Set the search bar to be visible or not, depending on the current value.
    $("#show-search-bar").prop("checked", data.search.show);
    $("#focus-search-bar").prop("checked", data.search.focus);

    // Fill the link configuration keys with what's in local storage. Will be blank if unset, and that's ok.
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

    // Set the checkboxes to the correct values, defaulting to false if no value exists.
    $("#show-link-box").prop("checked", data.links.show);
    $("#update-toggle").prop("checked", data.misc.updateCheck);
    $("#xkcd-toggle").prop("checked", data.misc.showXKCD);
    $("#invert-toggle").prop("checked", data.misc.invertXKCD);
    $("#custom-position-toggle").prop("checked", data.misc.useCustomPositioning);

    // Fill in the user's custom date formats, or the defaults if unavailable.
    // We set the global format strings in the process, used in time.js.   
    dateFormatString = data.misc.dateFormat;
    timeFormatString = data.misc.timeFormat;
    $("#date-format").val(dateFormatString);
    $("#time-format").val(timeFormatString);

    // If the user has the link box enabled, show it.
    // Move the XKCD box up or down accordingly.
    if (data.links.show) {
        $(".link-box").css("display", "block");
        $("#xkcd-zone").css("top", "850px");
    } else {
        $(".link-box").css("display", "none");
        $("#xkcd-zone").css("top", "500px");
    }

    // Somehow, showing/hiding the search bar doesn't affect the layout all that bad.
    if (data.search.show) {
        console.log("%cSearch bar is visible.", "color:green");
        $("#search-bar").css("display", "flex");
        $(".link-box").css("top", "500px");
        if (data.search.focus) {
            console.log("Search bar is focused.");
            $("#search-input").focus();
        }
    } else {
        console.log("%cSearch bar is hidden.", "color:red");
        $("#search-bar").css("display", "none");
        $(".link-box").css("top", "450px");
    }

    // If the user has indicated to check for updates at startup, do so.
    if (data.misc.updateCheck) {
        if (sessionStorage.getItem("404UPDATED") === "true") {
            // If the user has already checked for updates, don't do it again.
            console.log("%cAlready checked for updates, not checking again this session.", "color:red");
        } else {
            // Check for updates.
            sessionStorage.setItem("404UPDATED", "true");
            checkForUpdate(false);
        }
    }

    // If the user has indicated to auto-refresh the weather, do so at a 10-minute interval.
    if (data.weather.autoRefresh) {
        console.log("%cWeather auto-refresh enabled.", "color:lightgreen");

        function weatherRefresh() {
            getWeatherInfo(data.weather.code1, data.weather.code2, data.weather.units);
        }
        setInterval(weatherRefresh, 600000);
    }

    // If the user has indicated to show the XKCD comic, do so.
    if (data.misc.showXKCD) {
        $("#xkcd-zone").css("display", "block");
    } else {
        console.log("%cXKCD disabled", "color:lightblue");
        $("#xkcd-zone").css("display", "none");
    }
    // If the user has indicated to invert the XKCD comic, do so.
    if (data.misc.invertXKCD) {
        $("#x-img").css("filter", "invert(1)");
    } else {
        $("#x-img").css("filter", "invert(0)");
    }

    // If the user has indicated to use custom positioning, do so.
    currentCustomLayout = data.customLayout;
    if (data.misc.useCustomPositioning) {
        $("#edit-toggle").css("display", "block");
        setCustomLayout(currentCustomLayout);
    } else {
        $("#edit-toggle").css("display", "none");
    }

    // If we should be saving config because this is the first time, do so.
    if (saveAfterLoad) {
        saveToLS(false);
    }

    // Time to get weather info.
    getWeatherInfo(data.weather.code1, data.weather.code2, data.weather.units);
    // Show the first link group in the config menu by default.
    showLinkGroup(0);

    // And smoothly fade in.
    function unblur() {
        $('html').css('filter', 'none');
    }
    setTimeout(unblur, 250);
}

// Used to determine which link group to show in the config menu.
function showLinkGroup() {
    const x = parseInt($("#link-selector").val());
    $(".link-group").css("display", "none");
    $("#link-config-" + x).css("display", "block");
}

// Function to find all of the user's appearance settings and create a string of CSS to apply to the page.
function constructUserCSS() {
    console.log("%c" + "Constructing user CSS...", "color:lightblue");
    let userCSS = "* {"; // String starter with the universal selector.
    // Check if the backgroundImage field is set, this indicates the user has set a new custom background.
    if ($("#backgroundImage").val() == "") {
        // Field is not set, so use same one they're already using.
        userCSS += " --backgroundImage: " + styleVar("backgroundImage") + ";";
    } else {
        // Set the background image to the user's new one.
        userCSS += " --backgroundImage: url(data:image/jpg;base64," + base64String + ");";
    }
    $(".theme-val").each(function() {
        // For each theme value, add the CSS to the string.
        // Some special cases are handled here, like adding alpha to background colours, or adding "px" and "%" to values.
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
    // Return the completed string.
    return userCSS;
}

// Called whenever a new image is uploaded via the background image input.
function imageUploaded() {
    const file = document.querySelector('input[id=backgroundImage]')['files'][0];
    const reader = new FileReader();
    reader.onload = function() {
        // Get the image data as a base64 string, assign it to the global variable.
        base64String = reader.result.replace("data:", "").replace(/^.+,/, "");
    }
    reader.readAsDataURL(file);
}

// Used to get the currently set values from the user CSS.
function styleVar(key) {
    let style = window.getComputedStyle(document.documentElement);

    if (backgroundKeys.includes(key)) {
        // Special case for background colours, remove the last two digits of the hex code (alpha).
        return style.getPropertyValue("--" + key).trim().slice(0, 7);
    } else if (key == "borderRadius") {
        // Special case for border radius, remove the "px" at the end.
        return style.getPropertyValue("--" + key).trim().slice(0, -2);
    } else if (key == "weatherBoxMargin") {
        // Special case for weather box margin, remove the "%" at the end.
        return style.getPropertyValue("--" + key).trim().slice(0, -1);
    }
    return style.getPropertyValue("--" + key).trim();
}

// If the user has not set any values for a particular key, fill it with the default value.
function fillMissingValues(data) {
    for (let key in defaults) {
        if (data[key] === undefined) {
            console.log("%c" + "Filling in missing value for: " + key, "color:orange");
            data[key] = defaults[key];
            console.log("Value filled in: ", data[key]);
        } else {
            for (let subKey in defaults[key]) {
                if (data[key][subKey] === undefined || data[key][subKey] === "") {
                    console.log("%c" + "Filling in missing value for: " + key + "." + subKey, "color:orange");
                    data[key][subKey] = defaults[key][subKey];
                    console.log("Value filled in: ", data[key][subKey]);
                }
            }
        }
    }
}

// Function to export the user's settings to a JSON file.
function exportConfig() {
    saveToLS(true); //Save the config to local storage, so what we export is the latest.
    console.log("%c" + "Exporting config...", "color:lightblue");
    const themeJSON = localStorage.getItem("404CONFIG"); // Get the config from local storage.
    const file = new Blob([themeJSON], { type: "application/json" }); // Create a new Blob with the config.

    // Create a link to download the file.
    const a = document.createElement("a");
    a.href = URL.createObjectURL(file);
    const fileName = prompt("Name of this theme?", "404-Start_" + Date.now()); // Ask the user for a name for the file, the default is the current timestamp.
    if (fileName) {
        a.download = fileName + ".json";
        document.body.appendChild(a); // Append the link to the body.
        a.click(); // Click it.
        document.body.removeChild(a); //Remove it
        URL.revokeObjectURL(a.href); //Get rid of the url to our file
    }
}

// Called when the user presses the "Import" button.
function importTrigger() {
    // Since we can only trigger the file picker from a file input, the "Import" button will simply activate a hidden file input.
    console.log("%c" + "Importing config...", "color:lightblue");
    $("#import-theme-button").click();
}

function importConfig() {
    const file = document.querySelector('input[id=import-theme-button]')['files'][0]; // Get the file from the hidden file input.
    const reader = new FileReader();
    reader.onload = function() {
        const oldData = JSON.parse(localStorage.getItem("404CONFIG")); // Get the current config from local storage, this will be the 'old' config.
        try {
            const data = JSON.parse(reader.result); // Get the config from the uploaded file, this will be the 'new' config.
            const incomingDataVersion = data.version || 0; // Check the data version of the incoming file, if it's not set, assume it's 0.
            console.log("%c" + "Current data version: " + dataVersion, "color:lightblue");
            console.log("%c" + "Minimum data version: " + minimumSupportedDataVersion, "color:lightblue");
            console.log("%c" + "Incoming data version: " + incomingDataVersion, "color:lightblue");
            // Check incoming data version against the minimum supported version.
            if (minimumSupportedDataVersion > incomingDataVersion) {
                // Theme is incompatible, show an error message and do nothing.
                console.log("%c" + "Incompatible theme: data version " + incomingDataVersion, "color:red");
                alert(file.name + " is from an older version of 404 Start, and cannot be imported.");
                return;
            }
            // Check if the incoming theme is identical to the current theme.
            if (JSON.stringify(data) === JSON.stringify(oldData)) {
                // The themes are identical, do nothing.
                console.log("%c" + "No changes detected.", "color:lightblue");
                return;
            }
            // Overwrite the current theme with the incoming theme in local storage.
            localStorage.setItem("404CONFIG", JSON.stringify(data));
            loadFromLS(); // Reload
            hideModal(); // Hide the modal.
            console.log("%c" + "Successfully imported " + file.name, "color:green");
        } catch (e) {
            // Something went horribly wrong, such as the user uploading JSON that isn't an actual theme, or just plain garbage.
            console.log("%c" + "Error importing " + file.name, "color:red");
            alert("Error importing " + file.name + "\nEnsure the file is valid JSON, and an actual theme config.\n\n" + e);
            localStorage.setItem("404CONFIG", JSON.stringify(oldData)); // Restore the original config, in case it just got overwritten with god-knows-what.
            loadFromLS(); // Reload
        }
    }
    reader.readAsText(file);
    $("#import-theme-button").val(""); // After importing, clear the file input.
}

// hacky fixes for some Firefox oddities
function firefoxCheck() {
    if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
        console.log("%c" + "Firefox detected, applying fixes...", "color:lightblue");
        $("#close").css("margin-left", "236px");
        $("input[type=range]").css("margin-bottom", "0px");
        $("input[type=range]").css("margin-top", "0px");
        $("input[type=range]").css("transform", "translateY(3.5px)");
        $(".small-button i").css("vertical-align", "top");
        $(".alert-button").css("margin-top", "95px");
        $(".alert-button").css("margin-left", "-17px");
    }
}

// Function to check for unsaved changes when closing the config modal or leaving the page.
function warnUnsavedChanges() {
    if (unsavedChanges) {
        let answer = confirm("You have unsaved changes.\n\nClick OK to save your changes.\nIf you click Cancel, your changes will be discarded.");
        if (answer) {
            // save, then hide modal
            saveToLS();
            hideModal();
        } else {
            //discard changes, hide modal
            hideModal();
        }
    } else {
        hideModal();
    }
}

loadFromLS(); // Load from local storage immediately on page load.
firefoxCheck();

// Event listener to monitor changes made in other tabs/windows
// This prevents desyncs
window.addEventListener('storage', function(event) {
    if (event.key == "404CONFIG") {
        console.log("%c" + "Storage event detected.", "color:lightblue");
        // loadFromLS();
    }
});

// Listen for changes to any of the settings in the config and warn for unsaved changes.
$(".config-value").on("change", function() {
    unsavedChanges = true;
    $("#unsaved-indicator").show();
});

// Warn for unsaved changes on page unload.
window.onbeforeunload = function() {
    if (unsavedChanges) {
        return "You have unsaved changes. Are you sure you want to leave?";
    }
}
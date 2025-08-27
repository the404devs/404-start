const dataVersion = 5; // Current theme data version
const minimumSupportedDataVersion = 0; // Minimum supported data version, used to determine if an imported theme is compatible with the current version
let base64String = ""; // Will hold the base64 string of an uploaded image
// All theme keys representing the background colour of various elements
const backgroundKeys = ["background", "weatherBoxBackground", "modalBackground", "linkBoxBackground", "buttonBackground", "headerBackground", "todoBackground"];
let unsavedChanges = false; // Used to determine if the user has made any unsaved changes.

const weatherCode1 = $('#weather-code-1');
const weatherCode2 = $('#weather-code-2');
const weatherUnits = $('#unit-selector');
const weatherAutoRefresh = $('#weather-auto-refresh');

const generalBackground = $('#background');
const generalForeground = $('#foreground');
const generalHighlight = $('#highlight');
const generalShadow = $('#shadow-color');
const generalShadowAlpha = $('#shadAlpha');
const generalBorder = $('#border');
const generalBorderAlpha = $('#bordAlpha');
const generalBorderRadius = $('#borderRadius');
const generalBackgroundAlpha = $('#boxAlpha');
const generalImage = $('#backgroundImage');

const headerForeground = $('#headerForeground');
const headerBackground = $('#headerBackground');
const headerAlpha = $('#headerAlpha');
const headerShadow = $('#headerShadow');

const weatherForeground = $('#weatherBoxForeground');
const weatherBackground = $('#weatherBoxBackground');
const weatherMargin = $('#weatherBoxMargin');

const modalForeground = $('#modalForeground');
const modalBackground = $('#modalBackground');

const buttonForeground = $('#buttonForeground');
const buttonBackground = $('#buttonBackground');
const buttonHighlight = $('#buttonHighlight');

const linkBoxForeground = $('#linkBoxForeground');
const linkBoxBackground = $('#linkBoxBackground');

const todoForeground = $('#todoForeground');
const todoBackground = $('#todoBackground');

const dateFormat = $('#date-format');
const timeFormat = $('#time-format');

const showSearchBar = $('#show-search-bar');
const focusSearchBar = $('#focus-search-bar');
const preferredSearchEngine = $('#search-engine-selector');

const showTodoList = $('#show-todo-list');
const showLinkBox = $('#show-link-box');
const showXKCD = $('#xkcd-toggle');
const invertXKCD = $('#invert-toggle');
const autoUpdateCheck = $('#update-toggle');


const indShadAlpha = $('#shadAlphaVal');
const indBordAlpha = $('#bordAlphaVal');
const indBordRad = $('#borderRadiusVal');
const indBoxAlpha = $('#boxAlphaVal');
const indHeadAlpha = $('#headerAlphaVal');
const indWeatherMargin = $('#weatherBoxMarginVal');


const linkElem1 = $('#link1');
const linkName1 = $('#link-name-1');
const linkURL1 = $('#link-url-1');

const linkElem2 = $('#link2');
const linkName2 = $('#link-name-2');
const linkURL2 = $('#link-url-2');

const linkElem3 = $('#link3');
const linkName3 = $('#link-name-3');
const linkURL3 = $('#link-url-3');

const linkElem4 = $('#link4');
const linkName4 = $('#link-name-4');
const linkURL4 = $('#link-url-4');

const linkElem5 = $('#link5');
const linkName5 = $('#link-name-5');
const linkURL5 = $('#link-url-5');

const linkElem6 = $('#link6');
const linkName6 = $('#link-name-6');
const linkURL6 = $('#link-url-6');

const unsavedIndicator = $('#unsaved-indicator');
const linkBox = $('#link-box');
const xkcdZone = $('#xkcd-zone');
const weatherBox1 = $('#weather-1');
const weatherBox2 = $('#weather-2');
const todoList = $('#todo');
const searchBar = $('#search-bar');
const header = $('#header');

const defaults = {
    "theme": {
        "headerShadow": true
    },
    "weather": {
        "code1": "6167865",
        "code2": "6077243",
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
    "todo": {
        "show": true
    },
    "misc": {
        "updateCheck": false,
        "showXKCD": false,
        "invertXKCD": false,
        "dateFormat": "%W, %MMMM %d, %Y",
        "timeFormat": "%hh:%m:%s %a"
    }
};

// Used to save current configuration to local storage.
function saveToLS(reload) {
    // In some situations we don't want to reload the config, so that's what the reload parameter is for.
    console.log("%cSaving user config...", "color:lightblue");
    const userCSS = constructUserCSS(); // Construct the user CSS from all the current theme values.
    // Construct a JSON object containing all the current config values.
    const data = {
        "theme": {
            "colours": userCSS,
            "headerShadow": headerShadow.checked
        },
        "weather": {
            "code1": weatherCode1.value,
            "code2": weatherCode2.value,
            "units": weatherUnits.value,
            "autoRefresh": weatherAutoRefresh.checked
        },
        "search": {
            "engine": preferredSearchEngine.value,
            "show": showSearchBar.checked,
            "focus": focusSearchBar.checked
        },
        "links": {
            "link1": {
                "name": linkName1.value,
                "url": linkURL1.value
            },
            "link2": {
                "name": linkName2.value,
                "url": linkURL2.value
            },
            "link3": {
                "name": linkName3.value,
                "url": linkURL3.value
            },
            "link4": {
                "name": linkName4.value,
                "url": linkURL4.value
            },
            "link5": {
                "name": linkName5.value,
                "url": linkURL5.value
            },
            "link6": {
                "name": linkName6.value,
                "url": linkURL6.value
            },
            "show": showLinkBox.checked
        },
        "todo": {
            "show": showTodoList.checked
        },
        "misc": {
            "updateCheck": autoUpdateCheck.checked,
            "showXKCD": showXKCD.checked,
            "invertXKCD": invertXKCD.checked,
            "dateFormat": dateFormat.value,
            "timeFormat": timeFormat.value
        },
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
        $("#unsaved-indicator").style.display = 'none';
        if (reload) {
            loadFromLS();
        }
        // hideModal();
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
        $$(".theme-val").forEach(setting => {
            setting.value = styleVar(setting.id);
        });
        saveAfterLoad = true; // Indicate that we should save after loading.
        saveToLS(false); // Save without reloading to set the default CSS values, we will save properly later.
        data = JSON.parse(localStorage.getItem("404CONFIG")); // Grab config again, with the default CSS now in place.
    }

    // Remove any existing style tags, such as ones containing the old CSS after the user makes a change to the theme.
    $$("#USER-STYLE").forEach(style => {
        style.remove();
    })
    // Pop in a new style tag with the current theme CSS.
    const userStyle = document.createElement('style');
    userStyle.id = "USER-STYLE";
    userStyle.innerHTML = data.theme.colours;
    $("head").appendChild(userStyle);

    // Fill all the theme config inputs (colours, etc) with the values of the current theme.
    $$(".theme-val").forEach(setting => {
        setting.value = styleVar(setting.id);
    });

    fillMissingValues(data); // Fill in any missing values in the config.
    dataFixer(data);

    // Set the indicator labels for the slider-based inputs.
    indBoxAlpha.innerHTML = (generalBackgroundAlpha.value * 100).toFixed(0) + '%';
    indShadAlpha.innerHTML = (generalShadowAlpha.value * 100).toFixed(0) + '%';
    indBordAlpha.innerHTML = (generalBorderAlpha.value * 100).toFixed(0) + '%';
    indHeadAlpha.innerHTML = (headerAlpha.value * 100).toFixed(0) + '%';
    indBordRad.innerHTML = (generalBorderRadius.value * 100).toFixed(0) + '%';
    indWeatherMargin.innerHTML = (weatherMargin.value * 100).toFixed(0) + '%';
    

    // Fill the weather configuration keys with what's in local storage, or the default if unavailable.
    weatherCode1.value = data.weather.code1;
    weatherCode2.value = data.weather.code2;
    weatherUnits.value = data.weather.units;
    weatherAutoRefresh.checked = data.weather.autoRefresh;

    // Fill the search engine selector with the current value, or the default if unavailable.
    preferredSearchEngine.value = data.search.engine;
    // Set the search bar to be visible or not, depending on the current value.
    showSearchBar.checked = data.search.show;
    focusSearchBar.checked = data.search.focus;

    
    showTodoList.checked = data.todo.show;
    headerShadow.checked = data.theme.headerShadow;

    // Fill the link configuration keys with what's in local storage. Will be blank if unset, and that's ok.

    linkName1.value = data.links.link1.name;
    linkURL1.value = data.links.link1.url;
    linkElem1.href = data.links.link1.url;
    linkElem1.textContent = data.links.link1.name;

    linkName2.value = data.links.link2.name;
    linkURL2.value = data.links.link2.url;
    linkElem2.href = data.links.link2.url;
    linkElem2.textContent = data.links.link2.name;

    linkName3.value = data.links.link3.name;
    linkURL3.value = data.links.link3.url;
    linkElem3.href = data.links.link3.url;
    linkElem3.textContent = data.links.link3.name;

    linkName4.value = data.links.link4.name;
    linkURL4.value = data.links.link4.url;
    linkElem4.href = data.links.link4.url;
    linkElem4.textContent = data.links.link4.name;

    linkName5.value = data.links.link5.name;
    linkURL5.value = data.links.link5.url;
    linkElem5.href = data.links.link5.url;
    linkElem5.textContent = data.links.link5.name;

    linkName6.value = data.links.link6.name;
    linkURL6.value = data.links.link6.url;
    linkElem6.href = data.links.link6.url;
    linkElem6.textContent = data.links.link6.name;

    // Set the checkboxes to the correct values, defaulting to false if no value exists.
    showLinkBox.checked = data.links.show;
    autoUpdateCheck.checked = data.misc.updateCheck;
    showXKCD.checked = data.misc.showXKCD;
    invertXKCD.checked = data.misc.invertXKCD;

    // Fill in the user's custom date formats, or the defaults if unavailable.
    // We set the global format strings in the process, used in time.js.   
    dateFormatString = data.misc.dateFormat;
    timeFormatString = data.misc.timeFormat;
    dateFormat.value = dateFormatString;
    timeFormat.value = timeFormatString;

    // If the user has the link box enabled, show it.
    if (data.links.show) {
        linkBox.style.display = 'block';
    } else {
        linkBox.style.display = 'none';
    }
    
    // Move the XKCD box up or down accordingly.
    if (data.links.show || data.todo.show) {
        xkcdZone.style.top = '850px';
    } else {
        xkcdZone.style.top = '500px';
    }

    // Somehow, showing/hiding the search bar doesn't affect the layout all that bad.
    if (data.search.show) {
        console.log("%cSearch bar is visible.", "color:green");
        searchBar.style.display = 'flex';
        linkBox.style.top = '500px';
        if (data.search.focus) {
            console.log("Search bar is focused.");
            $("#search-input").focus();
        }
    } else {
        console.log("%cSearch bar is hidden.", "color:red");
        searchBar.style.display = 'none';
        linkBox.style.top = '450px';
    }

    if (data.todo.show) {
        console.log("%cTodo list is visible.", "color:green");
        todoList.style.display = 'flex';
    } else {
        console.log("%cTodo list is hidden.", "color:red");
        todoList.style.display = 'none';
    }

    // If the user has indicated to check for updates at startup, do so.
    if (data.misc.updateCheck) {
        if (sessionStorage.getItem("UPDATE-CHECK") === "true") {
            // If the user has already checked for updates, don't do it again.
            console.log("%cAlready checked for updates, not checking again this session.", "color:red");
        } else {
            // Check for updates.
            sessionStorage.setItem("UPDATE-CHECK", "true");
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
        xkcdZone.style.display = 'flex';
    } else {
        console.log("%cXKCD disabled", "color:lightblue");
        xkcdZone.style.display = 'none';
    }
    // If the user has indicated to invert the XKCD comic, do so.
    if (data.misc.invertXKCD) {
        $("#x-img").style.filter = 'invert(1)';
    } else {
        $("#x-img").style.filter = 'invert(0)';
    }

    if (!data.theme.headerShadow) {
        header.classList.add("no-shadow");
    } else {
        header.classList.remove("no-shadow");
    }

    // If we should be saving config because this is the first time, do so.
    if (saveAfterLoad) {
        saveToLS(false);
    }

    // Time to get weather info.
    getWeatherInfo(data.weather.code1, data.weather.code2, data.weather.units);
    icons.color = weatherForeground.value;
    // Show the first link group in the config menu by default.
    showLinkGroup(0);

    // And smoothly fade in.
    function unblur() {
        $('body').style.filter = 'none';
    }
    setTimeout(unblur, 250);
}

// Used to determine which link group to show in the config menu.
function showLinkGroup() {
    const x = parseInt($("#link-selector").value);
    $$(".link-group").forEach(lg => {
        lg.style.display = 'none';
    })
    $("#link-config-" + x).style.display = 'block';
}

// Function to find all of the user's appearance settings and create a string of CSS to apply to the page.
function constructUserCSS() {
    console.log("%c" + "Constructing user CSS...", "color:lightblue");
    let userCSS = "* {"; // String starter with the universal selector.

    // For each theme value, add the CSS to the string.
    // Some special cases are handled here, like adding alpha to background colours, or adding "px" and "%" to values.
    $$(".theme-val").forEach(setting => {
        userCSS += " --" + setting.id + ": " + setting.value;
        if (setting.id == "headerBackground") {
            let alpha = 255 * Number(headerAlpha.value);
            userCSS += Math.round(alpha).toString(16);
        } else if (backgroundKeys.includes(setting.id)) {
            let alpha = 255 * Number(generalBackgroundAlpha.value);
            userCSS += Math.round(alpha).toString(16);
        } else if (setting.id == "shadow-color") {
            let alpha = 255 * Number(generalShadowAlpha.value);
            userCSS += Math.round(alpha).toString(16);
        } else if (setting.id == "border") {
            let alpha = 255 * Number(generalBorderAlpha.value);
            userCSS += Math.round(alpha).toString(16);
            userCSS += "; --borderIgnoreAlpha: " + setting.value;
        } else if (setting.id == "borderRadius") {
            userCSS += "px";
        } else if (setting.id == "weatherBoxMargin") {
            userCSS += "%";
        }
        userCSS += ";";
    });

    // Check if the backgroundImage field is set, this indicates the user has set a new custom background.
    if (generalImage.value == "") {
        // Field is not set, so use same one they're already using.
        userCSS += ` --backgroundImage: ${styleVar("backgroundImage")};`;
    } else {
        // Set the background image to the user's new one.
        userCSS += ` --backgroundImage: url(${base64String});`;
        console.log("Importing new bg!");
        console.log(`${base64String}`);
    }

    userCSS += "}";
    // Return the completed string.
    return userCSS;
}

// Called whenever a new image is uploaded via the background image input.
function imageUploaded() {
    const file = $('input[id=backgroundImage]')['files'][0];
    const reader = new FileReader();
    reader.onload = function() {
        // Get the image data as a base64 string, assign it to the global variable.
        base64String = reader.result;
    }
    reader.readAsDataURL(file);
}

// Used to get the currently set values from the user CSS.
function styleVar(key) {
    let style = window.getComputedStyle(document.documentElement);

    if (backgroundKeys.includes(key)) {
        // Special case for background colours, remove the last two digits of the hex code (alpha).
        return style.getPropertyValue("--" + key).trim().slice(0, 7);
    } else if (key == "shadow-color") {
        return style.getPropertyValue("--" + key).trim().slice(0, 7);
    } else if (key == "border") {
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
    $("#import-theme-button").value = ""; // After importing, clear the file input.
}

function dataFixer(data) {
    return;
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
$$(".config-value").forEach(cv => {
    cv.addEventListener('change', function() {
        unsavedChanges = true;
        unsavedIndicator.style.display = "block";
    })
})

// Warn for unsaved changes on page unload.
window.onbeforeunload = function() {
    if (unsavedChanges) {
        return "You have unsaved changes. Are you sure you want to leave?";
    }
}

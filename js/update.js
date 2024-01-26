let LOCAL = false; // A global variable to store the state of 404-Start (local file or online)

function checkIfLocal() {
    // Simple way to check if the file is local: does the URL contain "file://"?
    // There are a few config options that aren't necessary, when used online, so we hide those.
    if (document.location.href.startsWith("file://")) {
        console.log("%c404-Start is running as a local file.", "color:magenta;font-weight:bold;font-style:italic;");
        $("#local-settings").show();
        LOCAL = true;
    } else {
        console.log("%c404-Start is running online at start.the404.nl ", "color:magenta;font-weight:bold;font-style:italic;");
        $("#local-settings").hide();
    }
}

function getVersion(url, callback) {
    // Function to send a GET request to the given URL and return the response.
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'text';
    xhr.onload = function() {
        const status = xhr.status;
        if (status === 200) {
            callback(xhr.response);
        } else {
            callback(xhr.response);
        }
    };
    xhr.send();
};

function checkForUpdate(manual) {
    // 'manual' is a boolean that determines if the user has clicked the "Check for update" button, or if this is an automatic check.
    getVersion("https://start.the404.nl/VER", function(data) {
        // We grab the version from the master branch currently deployed on GitHub.
        const newestVer = data.replace("v", "").trim();
        const currentVer = config.VER.replace("v", "").trim();
        // We remove the 'v' from the version strings and remove any whitespace, for example "v1.0.0 " becomes "1.0.0"
        console.log(`Current version is: ${currentVer}, newest one online is: ${newestVer}`);

        // Check if the current version is the newest version, and proceed accordingly.
        if (compareVersions(currentVer, newestVer)) {
            // Outdated version.
            console.log("%c404-Start is outdated!", "color:red;font-weight:bold;font-style:italic;");
            if (confirm(`404-Start: There is an update available!\n\nLatest version: ${newestVer}\nCurrent version: ${currentVer}\n\nPress OK to go to the Github page to get the update and see the changelog.\nYou can turn this message off in the ⚙ settings menu.`)) {
                location.href = "https://github.com/the404devs/404-start/releases/latest";
            }
        } else {
            // Up to date. If this is a manual check, we show a message to the user.
            if (manual) {
                alert(`404-Start is up to date! \n\nLatest version: ${newestVer} \nCurrent version: ${currentVer}`);
            }
            console.log("%c404-Start is up to date!", "color:green;font-weight:bold;font-style:italic;");
        }
    });
}

function compareVersions(currentVer, newestVer) {
    // To compare the two versions, we split each into an array of numbers and compare each number, starting from the major value.
    const currentVerArr = currentVer.split(".");
    const newestVerArr = newestVer.split(".");
    for (let i = 0; i < currentVerArr.length; i++) {
        if (currentVerArr[i] < newestVerArr[i]) {
            // If at any point our current version number is smaller than the newest version number, we return true.
            return true;
        }
    }
    return false;
}

// checkIfLocal() runs immediately.
checkIfLocal();
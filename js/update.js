var LOCAL = false;

function checkIfLocal() {
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
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'text';
    xhr.onload = function() {
        var status = xhr.status;
        if (status === 200) {
            callback(xhr.response);
        } else {
            callback(xhr.response);
        }
    };
    xhr.send();
};

function checkForUpdate(manual) {
    getVersion("https://start.the404.nl/VER", function(data) {
        var newestVer = parseInt(data.replace(/\D/g, ''));
        var currentVer = parseInt(config.VER.replace(/\D/g, ''));
        console.log("Current version is: " + currentVer + ", newest one online is: " + newestVer);
        if (currentVer < newestVer) {
            if (confirm("There is an update available!\n\nLatest version: " + data + "Current version: " + config.VER + "\n\nPress OK to go to the Github page to get the update and see the changelog.\nYou can turn this message off in the ⚙ settings menu.")) {
                location.href = "https://github.com/the404devs/404-start/releases";
            }
        } else {
            if (manual) { alert("404-Start is up to date!") }
        }
    });
}

checkIfLocal();
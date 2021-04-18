// Initialize Firebase
firebase.initializeApp(fire_config);
firebase.firestore().settings({
    cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED
});
firebase.firestore().enablePersistence({
    synchronizeTabs: true
});
var db = firebase.firestore();
var deferAuthCheck = false;
var uid = "";

firebase.auth().onAuthStateChanged(function(user) {
    console.log("%cChecking for signed in user... ", "color:yellow;font-weight:bold;font-style:italic;");
    if (user) {
        console.log("%cPersistent user from previous session. ", "color:lightblue;font-weight:bold;font-style:italic;");
        if (deferAuthCheck) {
            console.log("%cDeferred auth check, new user being created. ", "color:red;font-weight:bold;font-style:italic;");
        } else {
            loginSuccess();
        }
    } else {
        console.log("%cNo user is logged in. ", "color:lightblue;font-weight:bold;font-style:italic;");
        getWeatherInfo("Toronto", "CA", "Montreal", "CA", "metric");
        $("#plus").hide();
        $("#config-save-button").hide();
    }

    function unblur() {
        $('html').css('filter', 'none');
    }
    setTimeout(unblur, 1500);
});

function createAccount() {
    var email = $("#reg-email").val();
    var pass = $("#reg-pass").val();
    console.log("%cCreating new user for " + email, "color:lightblue;font-weight:bold;font-style:italic;");
    deferAuthCheck = true;
    firebase.auth().createUserWithEmailAndPassword(email, pass)
        .then((userCredential) => {
            // Signed in 
            uid = firebase.auth().currentUser.uid;
            setDefaults(uid, email).then(() => loginSuccess());
            console.log("%cSuccessfully created new user!", "color:green;font-weight:bold;font-style:italic;");
        })
        .catch((error) => {
            console.log("%c" + error.code + ": " + error.message, "color:red;font-weight:bold;font-style:italic;");
            // $("#errmsg2").css("height", "30px");
            $("#errmsg2").css("opacity", "1");
            $("#errmsg2").text(error.message);
        });
}

function login() {
    var email = $("#login-email").val();
    var pass = $("#login-pass").val();
    console.log("%cAttempting to log in as " + email, "color:lightblue;font-weight:bold;font-style:italic;");

    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(firebase.auth().signInWithEmailAndPassword(email, pass)
            .then((userCredential) => {
                // Signed in 
                var user = userCredential.user;
                console.log("%cUser signed into existing account.", "color:green;font-weight:bold;font-style:italic;");
                // loginSuccess();
                // authstatechanged should catch this and call loginSuccess()
            })
            .catch((error) => {
                console.log("%c" + error.code + ": " + error.message, "color:red;font-weight:bold;font-style:italic;");
                // $("#errmsg1").css("height", "30px");
                $("#errmsg1").css("opacity", "1");
                $("#errmsg1").text(error.message);
            }));
}

function loginSuccess() {
    deferAuthCheck = false;
    hideModal();
    $("#settings-not-signed-in").hide();
    $("#settings-signed-in").show();
    $("#user-email").html(firebase.auth().currentUser.email);
    $("#plus").show();
    $("#config-save-button").show();
    uid = firebase.auth().currentUser.uid;
    console.log("%cAttempting to load user config...", "color:lightblue;font-weight:bold;font-style:italic;");
    getConfig();
}

function logout() {
    firebase.auth().signOut().then(() => {
        hideModal();
        $("#settings-not-signed-in").show();
        $("#settings-signed-in").hide();
        $("#user-email").html("");
        uid = "";
        console.log("%cUser logged out.", "color:green;font-weight:bold;font-style:italic;");
        location.reload();
    }).catch((error) => {
        console.log("%c" + error.code + ": " + error.message, "color:red;font-weight:bold;font-style:italic;");
    });
}

function getConfig() {
    console.log("%cAttempting to load user's general config...", "color:lightblue;font-weight:bold;font-style:italic;");
    loadGeneralConfig();
    console.log("%cAttempting to load user's preferred links...", "color:lightblue;font-weight:bold;font-style:italic;");
    loadLinks();
    console.log("%cAttempting to load weather data...", "color:lightblue;font-weight:bold;font-style:italic;");
    loadWeather();
    console.log("%cGetting todo list...", "color:lightblue;font-weight:bold;font-style:italic;");
    readEvents();
}

async function setConfig() {
    console.log("%cSaving user config...", "color:yellow;font-weight:bold;font-style:italic;");
    var city1 = $("#city-name-1").val();
    var city2 = $("#city-name-2").val();
    var country1 = $("#country-sel-1").val();
    var country2 = $("#country-sel-2").val();
    var units = $("#unit-selector").val();
    await db.collection(uid).doc("Weather").set({
        Place1: [city1, country1],
        Place2: [city2, country2],
        Units: units
    });
    await db.collection(uid).doc("General").update({
        XKCD: $("#xkcd-toggle").prop("checked"),
        Update: $("#update-toggle").prop("checked"),
        Pywal: $("#pywal-toggle").prop("checked"),
        Colours: [$("#background-colour").val(), $("#foreground-colour").val(), $("#highlight-colour").val(), $("#header-colour").val()],
        XKCDinvert: $("#invert-toggle").prop("checked"),
        PywalPath: $("#pywal-path").val()
    });
    //TODO: make this a for loop or something
    await db.collection(uid).doc("Links").set({
        Link1: [$("#link-config-1").children("input")[0].value, $("#link-config-1").children("input")[1].value, $("#link-config-1").children("input")[2].value],
        Link2: [$("#link-config-2").children("input")[0].value, $("#link-config-2").children("input")[1].value, $("#link-config-2").children("input")[2].value],
        Link3: [$("#link-config-3").children("input")[0].value, $("#link-config-3").children("input")[1].value, $("#link-config-3").children("input")[2].value],
        Link4: [$("#link-config-4").children("input")[0].value, $("#link-config-4").children("input")[1].value, $("#link-config-4").children("input")[2].value],
        Link5: [$("#link-config-5").children("input")[0].value, $("#link-config-5").children("input")[1].value, $("#link-config-5").children("input")[2].value],
        Link6: [$("#link-config-6").children("input")[0].value, $("#link-config-6").children("input")[1].value, $("#link-config-6").children("input")[2].value],
        Link7: [$("#link-config-7").children("input")[0].value, $("#link-config-7").children("input")[1].value, $("#link-config-7").children("input")[2].value],
    });
    getConfig();
    hideModal();
}

async function loadLinks() {
    $("#left").empty();
    $("#link-settings").empty();
    var query = await db.collection(uid).doc("Links").get({ source: 'server' });
    var keylist = [];
    var regen = false;
    var links = query.data();
    for (l in links) {
        keylist.push(l);
    }
    keylist.sort();
    for (let i = 1; i < 8; i++) {
        try {
            $("#left").append(
                $("<a>").attr("href", links["Link" + i][1]).append(
                    $("<span>").addClass("button").html(links["Link" + i][2] + " " + links["Link" + i][0])
                )
            ).append($("<br>"));
            $("#link-settings").append($("<div>").addClass("link-group").attr("id", "link-config-" + i).append(
                $("<label>").text("Name: ")
            ).append(
                $("<input>").val(links["Link" + i][0])
            ).append(
                $("<br>")
            ).append(
                $("<label>").text("Destination: ")
            ).append(
                $("<input>").val(links["Link" + i][1])
            ).append(
                $("<br>")
            ).append(
                $("<label>").text("Icon HTML: ")
            ).append(
                $("<input>").val(links["Link" + i][2])
            ));
        } catch (error) {
            console.log("%cMissing link " + i + ", defaulting to the404.", "color:red;font-weight:bold;font-style:italic;");
            regen = true;
            db.collection(uid).doc("Links").update({
                ["Link" + i]: ["The404", "https://the404.nl/", "<i class='texticon'>404</i>"]
            });
        }
    }
    if (regen) { loadLinks() }
    setTimeout(applyFilter, 500);
    $("#link-config-1").css("display", "block");
    $("#link-selector").val(1);
}

async function loadGeneralConfig() {
    var query = await db.collection(uid).doc("General").get({ source: 'server' });
    var generalConfig = query.data();
    var regen = false;

    if ("XKCD" in generalConfig) {
        $("#xkcd-toggle").prop("checked", generalConfig.XKCD);
        if (generalConfig.XKCD) { $("#xkcd-zone").show() } else { $("#xkcd-zone").hide() }
    } else {
        regen = true;
        db.collection(uid).doc("General").update({
            XKCD: false
        });
    }

    if ("XKCDinvert" in generalConfig) {
        $("#invert-toggle").prop("checked", generalConfig.XKCDinvert);
        if (generalConfig.XKCDinvert) { $("#x-img").css("filter", "invert(1)") } else { $("#x-img").css("filter", "invert(0)") }
    } else {
        regen = true;
        db.collection(uid).doc("General").update({
            XKCDinvert: false
        });
    }

    if ("Update" in generalConfig) {
        $("#update-toggle").prop("checked", generalConfig.Update);
        if (generalConfig.Update && LOCAL) {
            console.log("%cChecking for update...", "color:yellow;font-weight:bold;font-style:italic;");
            checkForUpdate(false);
        }
    } else {
        regen = true;
        db.collection(uid).doc("General").update({
            Update: false
        });
    }

    if ("Pywal" in generalConfig && "Colours" in generalConfig) {
        $("#pywal-toggle").prop("checked", generalConfig.Pywal);
        $("#pywal-path").val(generalConfig.PywalPath);
        if (generalConfig.Pywal && LOCAL) {
            console.log("%cApplying pywal colours...", "color:yellow;font-weight:bold;font-style:italic;");
            // $('head').append('<link rel="stylesheet" type="text/css" id="pywal-css" href=file://' + generalConfig.PywalPath + '>');
            loadCSS("file://" + generalConfig.PywalPath);
        } else {
            console.log("%cApplying user colours...", "color:yellow;font-weight:bold;font-style:italic;");
            $("#pywal-css").remove();
            //Apply custom theme here.
            applyUserColours(generalConfig.Colours);
        }
        $("#background-colour").val(generalConfig.Colours[0]);
        $("#foreground-colour").val(generalConfig.Colours[1]);
        $("#highlight-colour").val(generalConfig.Colours[2]);
        $("#header-colour").val(generalConfig.Colours[3]);
    } else {
        regen = true;
        db.collection(uid).doc("General").update({
            Update: false,
            Colours: ["#14101a", "#b1bfba", "#8A746B", "#9F8675"]
        });
    }

    if (regen) { loadGeneralConfig() }
}

async function loadWeather() {
    var query = await db.collection(uid).doc("Weather").get({ source: 'server' });
    var weatherConfig = query.data();
    var regen = false;
    if ("Place1" in weatherConfig && "Place2" in weatherConfig && "Units" in weatherConfig) {
        var city1 = weatherConfig.Place1[0];
        var city2 = weatherConfig.Place2[0];
        var country1 = weatherConfig.Place1[1];
        var country2 = weatherConfig.Place2[1];
        var units = weatherConfig.Units;
        $("#city-name-1").val(city1);
        $("#city-name-2").val(city2);
        $("#country-sel-1").val(country1);
        $("#country-sel-2").val(country2);
        $("#country-sel-2").val(country2);
        $("#unit-selector").val(units);
        getWeatherInfo(city1, country1, city2, country2, units);
    } else {
        regen = true;
        db.collection(uid).doc("Weather").set({
            Place1: ["Toronto", "CA"],
            Place2: ["Montreal", "CA"],
            Units: "metric"
        });
    }
    if (regen) { loadWeather() }
}

async function setDefaults(uid, addr) {
    console.log("%cSetting default values for new user", "color:yellow;font-weight:bold;font-style:italic;");
    var links = $("#left").children("a");
    console.log(addr);
    await db.collection(uid).doc("General").set({
        XKCD: false,
        email: addr,
        Update: false,
        Pywal: false,
        Colours: ["#14101a", "#b1bfba", "#8A746B", "#9F8675"],
        XKCDinvert: false
    });
    await db.collection(uid).doc("Links").set({
        Link1: [links[0].text.trim(), links[0].href, links[0].firstElementChild.firstElementChild.outerHTML],
        Link2: [links[1].text.trim(), links[1].href, links[1].firstElementChild.firstElementChild.outerHTML],
        Link3: [links[2].text.trim(), links[2].href, links[2].firstElementChild.firstElementChild.outerHTML],
        Link4: [links[3].text.trim(), links[3].href, links[3].firstElementChild.firstElementChild.outerHTML],
        Link5: [links[4].text.trim(), links[4].href, links[4].firstElementChild.firstElementChild.outerHTML],
        Link6: [links[5].text.trim(), links[5].href, links[5].firstElementChild.firstElementChild.outerHTML],
        Link7: [links[6].text.trim(), links[6].href, links[6].firstElementChild.firstElementChild.outerHTML]
    });
    await db.collection(uid).doc("Weather").set({
        Place1: ["Toronto", "CA"],
        Place2: ["Montreal", "CA"],
        Units: "metric"
    });
    await db.collection(uid).doc("Events").set({});
}

async function addEvent() {
    // var uid = firebase.auth().currentUser.uid;

    var title = $('#eventName').val();
    var date = $('#eventDate').val();
    var time = $('#eventTime').val();
    var desc = $('#eventBody').val();
    await db.collection(uid).doc("Events").update({
        [date + "-" + time + "-" + title]: [title, date, time, desc]
    });
    readEvents();
    $('#eventName').val("");
    $('#eventDate').val("");
    $('#eventTime').val("");
    $('#eventBody').val("");
    hideModal();
    console.log("%cAdded event!", "color:lightblue;font-weight:bold;font-style:italic;");
}

async function readEvents() {
    $("#todo-container").empty();
    // var uid = firebase.auth().currentUser.uid;
    var query = await db.collection(uid).doc("Events").get({ source: 'server' });
    var keylist = [];
    var events = query.data();
    for (e in events) {
        keylist.push(e);
    }
    keylist.sort();
    // console.log(keylist)
    for (let i = 0; i < keylist.length; i++) {
        // console.log(events[keylist[i]]);
        //div class event id
        $('#todo-container').append(
            $('<span/>').attr("id", keylist[i]).attr('class', 'todo').append(
                $('<span/>').attr('class', 'eventHead').html(events[keylist[i]][0])
            ).append(
                $('<span/>').attr('class', 'eventDate').html(events[keylist[i]][1])
            ).append(
                $('<span/>').attr('class', 'eventTime').html(events[keylist[i]][2])
            ).append(
                $('<span/>').attr('class', 'eventBody').html("- " + events[keylist[i]][3])
            ).append(
                $('<span/>').attr('class', 'delete').click(deleteEvent).html('×')
            )
        );
    }
}

var deleteEvent = async function(e) {
    console.log("%cDeleting an event...", "color:lightblue;font-weight:bold;font-style:italic;");
    var key = $(e.target).parent().attr("id");
    console.log(key);
    await db.collection(uid).doc("Events").update({
        [key]: firebase.firestore.FieldValue.delete()
    }).then(() => {
        readEvents();
    });
}.bind(this);

function applyUserColours(colours) {
    $("#user-css").remove();
    var sheet = "<style type='text/css' id='user-css'>:root{--background:" + colours[0] + "; --foreground:" + colours[1] + "; --color2: " + colours[2] + "; --color4:" + colours[3] + ";}</style>";
    $('head').append(sheet);
}

function showLinkGroup() {
    var x = parseInt($("#link-selector").val());
    $(".link-group").css("display", "none");
    $("#link-config-" + x).css("display", "block");
}

function loadCSS(cssURL) {
    $("head").append(
        $("<link rel='stylesheet'>").attr("href", cssURL)
    )
}
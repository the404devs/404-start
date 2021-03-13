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
        getWeather("Toronto", "CA", "Montreal", "CA", "metric");
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
            var uid = firebase.auth().currentUser.uid;
            setDefaults(uid, email).then(() => loginSuccess());
            console.log("%cSuccessfully created new user!", "color:green;font-weight:bold;font-style:italic;");
        })
        .catch((error) => {
            console.log("%c" + error.code + ": " + error.message, "color:red;font-weight:bold;font-style:italic;");
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

    console.log("%cAttempting to load user config...", "color:lightblue;font-weight:bold;font-style:italic;");
    getConfig();
}

function logout() {
    firebase.auth().signOut().then(() => {
        hideModal();
        $("#settings-not-signed-in").show();
        $("#settings-signed-in").hide();
        $("#user-email").html("");
        console.log("%cUser logged out.", "color:green;font-weight:bold;font-style:italic;");
        location.reload();
    }).catch((error) => {
        console.log("%c" + error.code + ": " + error.message, "color:red;font-weight:bold;font-style:italic;");
    });
}

async function getConfig() {
    var uid = firebase.auth().currentUser.uid;
    var docs = [];
    let userCollection = await db.collection(uid + "").get({ source: 'server' });

    userCollection.forEach((doc) => {
        docs.push({ id: doc.id, ...doc.data() })
    });

    $("#xkcd-toggle").prop("checked", docs[1].XKCD);
    $("#invert-toggle").prop("checked", docs[1].XKCDinvert);
    $("#update-toggle").prop("checked", docs[1].Update);
    $("#pywal-toggle").prop("checked", docs[1].Pywal);
    if (docs[1].XKCD) { $("#xkcd-zone").show() } else { $("#xkcd-zone").hide() }
    if (docs[1].XKCDinvert) { $("#x-img").css("filter", "invert(1)") } else { $("#x-img").css("filter", "invert(0)") }
    if (docs[1].Update && LOCAL) {
        console.log("%cChecking for update...", "color:yellow;font-weight:bold;font-style:italic;");
        checkForUpdate(false);
    }
    if (docs[1].Pywal) {
        console.log("%cApplying pywal colours...", "color:yellow;font-weight:bold;font-style:italic;");
        $('head').append('<link rel="stylesheet" type="text/css" id="pywal-css" href=' + config.Pywal + '>');
    } else {
        console.log("%cApplying user colours...", "color:yellow;font-weight:bold;font-style:italic;");
        $("#pywal-css").remove();
        //Apply custom theme here.
        applyUserColours(docs[1].Colours);
    }
    $("#background-colour").val(docs[1].Colours[0]);
    $("#foreground-colour").val(docs[1].Colours[1]);
    $("#highlight-colour").val(docs[1].Colours[2]);
    $("#header-colour").val(docs[1].Colours[3]);

    console.log("%cAttempting to load user's preferred links...", "color:lightblue;font-weight:bold;font-style:italic;");
    loadLinks(docs[2]);

    console.log("%cAttempting to load weather data...", "color:lightblue;font-weight:bold;font-style:italic;");
    var city1 = docs[3].Place1[0];
    var city2 = docs[3].Place2[0];
    var country1 = docs[3].Place1[1];
    var country2 = docs[3].Place2[1];
    var units = docs[3].Units;
    $("#city-name-1").val(city1);
    $("#city-name-2").val(city2);
    $("#country-sel-1").val(country1);
    $("#country-sel-2").val(country2);
    $("#country-sel-2").val(country2);
    $("#unit-selector").val(units);
    getWeather(city1, country1, city2, country2, units);
    setTimeout(applyFilter, 500);
    readEvents();
}

async function setConfig() {
    console.log("%cSaving user config...", "color:yellow;font-weight:bold;font-style:italic;");
    var uid = firebase.auth().currentUser.uid;
    var city1 = $("#city-name-1").val();
    var city2 = $("#city-name-2").val();
    var country1 = $("#country-sel-1").val();
    var country2 = $("#country-sel-2").val();
    var units = $("#unit-selector").val();
    await db.collection(uid).doc("Links").set({
        Link1: [$("#link1-config").children("input")[0].value, $("#link1-config").children("input")[1].value, $("#link1-config").children("input")[2].value],
        Link2: [$("#link2-config").children("input")[0].value, $("#link2-config").children("input")[1].value, $("#link2-config").children("input")[2].value],
        Link3: [$("#link3-config").children("input")[0].value, $("#link3-config").children("input")[1].value, $("#link3-config").children("input")[2].value],
        Link4: [$("#link4-config").children("input")[0].value, $("#link4-config").children("input")[1].value, $("#link4-config").children("input")[2].value],
        Link5: [$("#link5-config").children("input")[0].value, $("#link5-config").children("input")[1].value, $("#link5-config").children("input")[2].value],
        Link6: [$("#link6-config").children("input")[0].value, $("#link6-config").children("input")[1].value, $("#link6-config").children("input")[2].value],
        Link7: [$("#link7-config").children("input")[0].value, $("#link7-config").children("input")[1].value, $("#link7-config").children("input")[2].value],
    });
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
        XKCDinvert: $("#invert-toggle").prop("checked")
    });


    getConfig();
    hideModal();
}

function loadLinks(doc) {
    // This causes me physical pain
    $("#left").empty();
    $("#left").append(
        $("<a>").attr("href", doc.Link1[1]).append(
            $("<span>").addClass("button").html(doc.Link1[2] + " " + doc.Link1[0])
        )
    ).append($("<br>"));
    $("#left").append(
        $("<a>").attr("href", doc.Link2[1]).append(
            $("<span>").addClass("button").html(doc.Link2[2] + " " + doc.Link2[0])
        )
    ).append($("<br>"));
    $("#left").append(
        $("<a>").attr("href", doc.Link3[1]).append(
            $("<span>").addClass("button").html(doc.Link3[2] + " " + doc.Link3[0])
        )
    ).append($("<br>"));
    $("#left").append(
        $("<a>").attr("href", doc.Link4[1]).append(
            $("<span>").addClass("button").html(doc.Link4[2] + " " + doc.Link4[0])
        )
    ).append($("<br>"));
    $("#left").append(
        $("<a>").attr("href", doc.Link5[1]).append(
            $("<span>").addClass("button").html(doc.Link5[2] + " " + doc.Link5[0])
        )
    ).append($("<br>"));
    $("#left").append(
        $("<a>").attr("href", doc.Link6[1]).append(
            $("<span>").addClass("button").html(doc.Link6[2] + " " + doc.Link6[0])
        )
    ).append($("<br>"));
    $("#left").append(
        $("<a>").attr("href", doc.Link7[1]).append(
            $("<span>").addClass("button").html(doc.Link7[2] + " " + doc.Link7[0])
        )
    ).append($("<br>"));

    $("#link-settings").empty();
    $("#link-settings").append($("<span>").text("Link 1:"));
    $("#link-settings").append($("<div>").addClass("link-group").attr("id", "link1-config").append(
        $("<label>").text("Name: ")
    ).append(
        $("<input>").val(doc.Link1[0])
    ).append(
        $("<br>")
    ).append(
        $("<label>").text("Destination: ")
    ).append(
        $("<input>").val(doc.Link1[1])
    ).append(
        $("<br>")
    ).append(
        $("<label>").text("Icon HTML: ")
    ).append(
        $("<input>").val(doc.Link1[2])
    ));

    $("#link-settings").append($("<span>").text("Link 2:"));
    $("#link-settings").append($("<div>").addClass("link-group").attr("id", "link2-config").append(
        $("<label>").text("Name: ")
    ).append(
        $("<input>").val(doc.Link2[0])
    ).append(
        $("<br>")
    ).append(
        $("<label>").text("Destination: ")
    ).append(
        $("<input>").val(doc.Link2[1])
    ).append(
        $("<br>")
    ).append(
        $("<label>").text("Icon HTML: ")
    ).append(
        $("<input>").val(doc.Link2[2])
    ));

    $("#link-settings").append($("<span>").text("Link 3:"));
    $("#link-settings").append($("<div>").addClass("link-group").attr("id", "link3-config").append(
        $("<label>").text("Name: ")
    ).append(
        $("<input>").val(doc.Link3[0])
    ).append(
        $("<br>")
    ).append(
        $("<label>").text("Destination: ")
    ).append(
        $("<input>").val(doc.Link3[1])
    ).append(
        $("<br>")
    ).append(
        $("<label>").text("Icon HTML: ")
    ).append(
        $("<input>").val(doc.Link3[2])
    ));

    $("#link-settings").append($("<span>").text("Link 4:"));
    $("#link-settings").append($("<div>").addClass("link-group").attr("id", "link4-config").append(
        $("<label>").text("Name: ")
    ).append(
        $("<input>").val(doc.Link4[0])
    ).append(
        $("<br>")
    ).append(
        $("<label>").text("Destination: ")
    ).append(
        $("<input>").val(doc.Link4[1])
    ).append(
        $("<br>")
    ).append(
        $("<label>").text("Icon HTML: ")
    ).append(
        $("<input>").val(doc.Link4[2])
    ));

    $("#link-settings").append($("<span>").text("Link 5:"));
    $("#link-settings").append($("<div>").addClass("link-group").attr("id", "link5-config").append(
        $("<label>").text("Name: ")
    ).append(
        $("<input>").val(doc.Link5[0])
    ).append(
        $("<br>")
    ).append(
        $("<label>").text("Destination: ")
    ).append(
        $("<input>").val(doc.Link5[1])
    ).append(
        $("<br>")
    ).append(
        $("<label>").text("Icon HTML: ")
    ).append(
        $("<input>").val(doc.Link5[2])
    ));

    $("#link-settings").append($("<span>").text("Link 6:"));
    $("#link-settings").append($("<div>").addClass("link-group").attr("id", "link6-config").append(
        $("<label>").text("Name: ")
    ).append(
        $("<input>").val(doc.Link6[0])
    ).append(
        $("<br>")
    ).append(
        $("<label>").text("Destination: ")
    ).append(
        $("<input>").val(doc.Link6[1])
    ).append(
        $("<br>")
    ).append(
        $("<label>").text("Icon HTML: ")
    ).append(
        $("<input>").val(doc.Link6[2])
    ));

    $("#link-settings").append($("<span>").text("Link 7:"));
    $("#link-settings").append($("<div>").addClass("link-group").attr("id", "link7-config").append(
        $("<label>").text("Name: ")
    ).append(
        $("<input>").val(doc.Link7[0])
    ).append(
        $("<br>")
    ).append(
        $("<label>").text("Destination: ")
    ).append(
        $("<input>").val(doc.Link7[1])
    ).append(
        $("<br>")
    ).append(
        $("<label>").text("Icon HTML: ")
    ).append(
        $("<input>").val(doc.Link7[2])
    ));
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
    var uid = firebase.auth().currentUser.uid;

    var title = $('#eventName').val();
    var date = $('#eventDate').val();
    var time = $('#eventTime').val();
    var desc = $('#eventBody').val();
    await db.collection(uid).doc("Events").update({
        [date + time + title]: [title, date, time, desc]
    });
    readEvents();
    $('#eventName').val("");
    $('#eventDate').val("");
    $('#eventTime').val("");
    $('#eventBody').val("");
    hideModal();
    console.log("%cAdded event!...", "color:lightblue;font-weight:bold;font-style:italic;");
}

async function readEvents() {
    console.log("%cGetting todo list...", "color:lightblue;font-weight:bold;font-style:italic;");

    $("#todo-container").empty();
    var uid = firebase.auth().currentUser.uid;
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
        $('#todo-container').append(
            $('<span/>').attr('class', 'todo').append(
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

    var uid = firebase.auth().currentUser.uid;

    var box = $(e.target);
    var key = box.parent().find('.eventDate').html() + box.parent().find('.eventTime').html() + box.parent().find('.eventHead').html();
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
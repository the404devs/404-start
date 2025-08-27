setInterval(timer, 1000); // Update the time every second
let dateFormatString = ""; // These will hold the user's preferred date/time formats,
let timeFormatString = ""; // and are set in localstorage.js

function timer() {
    const d = new Date();
    const userFormattedDate = dateFormatter(d); // Get the date and time in the user's preferred formats
    const userFormattedTime = timeFormatter(d);
    $('#date').textContent = userFormattedDate; // Fill the date and time in the DOM
    $('#time').textContent = userFormattedTime;
}

function dateFormatter(d) {
    // I hate this so much, but it's the only way (?)
    const yearFull = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
    const yearShort = new Intl.DateTimeFormat('en', { year: '2-digit' }).format(d);
    const monthWordShort = new Intl.DateTimeFormat('en', { month: 'short' }).format(d);
    const monthWordLong = new Intl.DateTimeFormat('en', { month: 'long' }).format(d);
    const monthNumericalShort = new Intl.DateTimeFormat('en', { month: 'numeric' }).format(d);
    const monthNumericalLong = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d);
    const dayLong = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
    const dayShort = new Intl.DateTimeFormat('en', { day: 'numeric' }).format(d);
    const weekdayLong = new Intl.DateTimeFormat('en', { weekday: 'long' }).format(d);
    const weekdayShort = new Intl.DateTimeFormat('en', { weekday: 'short' }).format(d);

    // Substitute the placeholders with the values they represent
    let userFormattedDate = dateFormatString
        .replace("%MMMM", monthWordLong)
        .replace("%MMM", monthWordShort)
        .replace("%MM", monthNumericalLong)
        .replace("%M", monthNumericalShort)
        .replace("%d", dayShort)
        .replace("%D", dayLong)
        .replace("%y", yearShort)
        .replace("%Y", yearFull)
        .replace("%w", weekdayShort)
        .replace("%W", weekdayLong);
    return userFormattedDate;
}

function timeFormatter(d) {
    // Guess what? I still hate this.
    const hour24 = new Intl.DateTimeFormat('en-CA', { hour: 'numeric', hourCycle: 'h23' }).format(d);
    const hourShort = new Intl.DateTimeFormat('en', { hour: 'numeric', hour12: true }).format(d).replace(/\D/g, '');
    const hourLong = new Intl.DateTimeFormat('en', { hour: '2-digit', hour12: true }).format(d).replace(/\D/g, '');
    let minute = new Intl.DateTimeFormat('en', { minute: 'numeric' }).format(d);
    let second = new Intl.DateTimeFormat('en', { second: 'numeric' }).format(d);
    const ampm = new Intl.DateTimeFormat('en', { hour: 'numeric', hour12: true }).format(d).replace(/\d/g, '');

    minute = ('0' + minute).slice(-2); //Workaround for the lack of leading zeros 
    second = ('0' + second).slice(-2); //Maybe I'm just dumb

    // Substitute the placeholders with the values they represent
    let userFormattedTime = timeFormatString
        .replace("%hhh", hourLong)
        .replace("%hh", hourShort)
        .replace("%h", hour24)
        .replace("%m", minute)
        .replace("%s", second)
        .replace("%a", ampm);
    return userFormattedTime;
}

// There's a thing in the config that shows/hides the date/time keys and what they represent.
// This function controls that thing. Wow.
function toggleTimeDocs() {
    if ($('#time-docs').style.display == 'none') {
        $('#time-docs').style.display = 'block';
        $('#time-docs-clickable').textContent = 'Hide Format Documentation';
    } else {
        $('#time-docs').style.display = 'none';
        $('#time-docs-clickable').textContent = 'Show Format Documentation';
    }
}

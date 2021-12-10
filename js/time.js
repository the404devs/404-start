let time = setInterval(timer, 1000);
let dateFormatString = "";
let timeFormatString = "";

function timer() {
    let d = new Date();
    let userFormattedDate = dateFormatter(d);
    let userFormattedTime = timeFormatter(d);
    $('#date').html(userFormattedDate);
    $('#time').html(userFormattedTime);
}

function dateFormatter(d) {
    let yearFull = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
    let yearShort = new Intl.DateTimeFormat('en', { year: '2-digit' }).format(d);
    let monthWordShort = new Intl.DateTimeFormat('en', { month: 'short' }).format(d);
    let monthWordLong = new Intl.DateTimeFormat('en', { month: 'long' }).format(d);
    let monthNumericalShort = new Intl.DateTimeFormat('en', { month: 'numeric' }).format(d);
    let monthNumericalLong = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d);
    let dayLong = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
    let dayShort = new Intl.DateTimeFormat('en', { day: 'numeric' }).format(d);
    let weekdayLong = new Intl.DateTimeFormat('en', { weekday: 'long' }).format(d);
    let weekdayShort = new Intl.DateTimeFormat('en', { weekday: 'short' }).format(d);

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
    let hour24 = new Intl.DateTimeFormat('en-CA', { hour: 'numeric', hourCycle: 'h23' }).format(d);
    let hourShort = new Intl.DateTimeFormat('en', { hour: 'numeric', hour12: true }).format(d).replace(/\D/g, '');
    let hourLong = new Intl.DateTimeFormat('en', { hour: '2-digit', hour12: true }).format(d).replace(/\D/g, '');
    let minute = new Intl.DateTimeFormat('en', { minute: 'numeric' }).format(d);
    let second = new Intl.DateTimeFormat('en', { second: 'numeric' }).format(d);
    let ampm = new Intl.DateTimeFormat('en', { hour: 'numeric', hour12: true }).format(d).replace(/\d/g, '');

    minute = ('0' + minute).slice(-2); //Workaround for the lack of leading zeros 
    second = ('0' + second).slice(-2); //Maybe I'm just dumb

    let userFormattedTime = timeFormatString
        .replace("%hhh", hourLong)
        .replace("%hh", hourShort)
        .replace("%h", hour24)
        .replace("%m", minute)
        .replace("%s", second)
        .replace("%a", ampm);
    return userFormattedTime;
}


function toggleTimeDocs() {
    if ($('#time-docs').css('display') == 'none') {
        $('#time-docs').css('display', 'block');
        $('#time-docs-clickable').html('Hide Format Documentation');
    } else {
        $('#time-docs').css('display', 'none');
        $('#time-docs-clickable').html('Show Format Documentation');
    }
}
var baseURL = "https://xkcd.now.sh/?comic=",
    hinum, script, details = {},
    head = document.getElementsByTagName('head')[0];

function dataloaded(obj) {
    details = obj;
    fill_page();
}

function ById(id) { return document.getElementById(id); }

//Return an error message if n is not a valid comic number.
function valid_num(n) {
    var msg = '';

    switch (true) {
        //The empty string is valid - it's the current comic.
        case (n == 'latest'):
            break;
        case (parseInt(n, 10) != n || n < 1):
            msg = "'" + n + "' is not a positive integer";
            setnum(1);
            break;
        case (n > hinum):
            msg = n + " is too high.\nThe current comic is " + hinum;
            setnum(-1);
            break;
        case (n == 404):
            t = document.getElementById("x-img");
            t.src = "img/404-square-2.png";
            t.alt = "404";
            t.title = "Not Found";
            document.getElementById("x-title").innerHTML = "Not Found";
            break;
    }

    return msg;
}

function build_script(n) {
    var msg = valid_num(n);

    if (msg) {
        console.log(msg);
        n--;
        return;
    }

    if (script != undefined)
        head.removeChild(script);
    script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = baseURL + n + "?callback=dataloaded";
    // script.src = `https://xkcd.com/${n}/info.0.json`
    head.appendChild(script);
}

function pad(n) {
    return (n < 10) ? ("0" + n) : n;
}

function fill_page() {
    var t, num = details.num,
        url = "http://xkcd.com/" + num;
    console.log(num);
    console.log(details);

    document.getElementById("x-title").innerHTML = details.title + " - " + pad(details.month) + "/" + pad(details.day) + "/" + details.year;
    document.getElementById("x-num").innerHTML = num;


    t = document.getElementById("x-img");
    t.src = details.img;
    t.alt = details.title;
    t.title = details.alt;
    // document.getElementById("date").innerHTML = details.day + "/" + details.month + "/" + details.year;



    // document.getElementById("mouseover").innerHTML = details.alt;
    // document.getElementById("transcript").innerHTML = format_transcript(details.transcript);

    // t = document.getElementById("original")
    // t.href = url;
    // t.innerHTML = url;

    if (hinum == undefined)
        hinum = num;

    t = document.getElementById("x-num");
    if (t.value == '' || hinum == num)
        t.value = num;

    // window.scroll(0, document.body.scrollHeight);
}



function adjustImage(iArray) {
    var imageData = iArray.data;
    for (var i = 0; i < imageData.length; i += 4) {
        imageData[i + 3] = 0;
    }

    return iArray;
}

function format_transcript(s) {
    //Fix < and >
    s = s.replace(/</g, '&lt;')
    s = s.replace(/>/g, '&gt;')

    //Fix newlines
    s = s.replace(/\n/g, '<br>\n');

    //Add extra breaks before bracketed sections
    s = s.replace(/[[]{2}/g, '<br>\n[[');

    //Remove alt text from transcript
    s = s.replace(/{.*}/g, '');

    return s;
}

function setnum(delta) {
    var num = document.getElementById("x-num");

    if (num.value)
        num.value = num.value - 0 + delta;
    build_script(num.value);
}

function goto() {
    var num = document.getElementById("x-num");
    build_script(num.value);
}

function random() {
    var n, num = document.getElementById("x-num");

    do n = Math.floor(1 + Math.random() * hinum);
    while (valid_num(n) != '');
    num.value = n;
    build_script(num.value);
}

document.getElementById("x-num").addEventListener("keyup", function(e) {
    if (e.key === "Enter") {
        e.preventDefault();
        goto();
    }
});

build_script('latest');
window.scroll(0, 0);

// var canvas = document.getElementById("xkcd");
// var ctx = canvas.getContext("2d");
// var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
// ctx.putImageData(this.adjustImage(imgData), 0, 0);
// var img = document.getElementById("x-img");
// ctx.drawImage(img, 10, 10);

async function fetchComic(n) {
    let nStr = n == 0 ? "latest" : n.toString();
    const response = await fetch(`https://xkcd.now.sh/?comic=${nStr}`);
    const comic = response.json();
    console.log(comic);
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


fetchComic(0);
let currentComic = 0;
let maxComic = 0;

async function fetchComic(n) {
    let nStr;
    img = document.getElementById("x-img");
    switch (n) {
        case 0:
            nStr = "latest";
            break;
        case 404:
            img.src = "img/404-square-2.png";
            img.alt = "404";
            img.title = "Not Found";
            document.getElementById("x-title").textContent = "Not Found";
            break;
        default:
            if (n > maxComic) { 
                nStr = maxComic.toString();
            } else {
                nStr = n.toString();
            }
            break;
    }

    const response = await fetch(`https://xkcd.now.sh/?comic=${nStr}`);
    const comic = await response.json();
    console.log(comic);
    document.getElementById("x-title").textContent = comic.title + " - " + pad(comic.month) + "/" + pad(comic.day) + "/" + comic.year;
    document.getElementById("x-num").value = comic.num.toString();

    currentComic = comic.num;
    if (n == 0) { maxComic = comic.num };

    img.src = comic.img;
    img.alt = comic.title;
    img.title = comic.alt;
}

function pad(n) {
    if (n < 10 && n > 0) {
        return `0${n}`;
    } else {
        return n.toString();
    }
}

function nextComic(i) {
    currentComic += i;
    if (currentComic > maxComic) { currentComic = 1 }
    if (currentComic < 1) { currentComic = maxComic }
    fetchComic(currentComic);
}

function random() {
    do r = Math.floor(1 + Math.random() * maxComic);
    while (r == currentComic);
    fetchComic(r);
}

document.getElementById("x-num").addEventListener("keyup", function(e) {
    if (e.key === "Enter") {
        e.preventDefault();
        fetchComic(document.getElementById("x-num").value);
    }
});

fetchComic(0);
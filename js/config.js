const config = {
    "ExtPath": "file:///home/the404/homepage/index.html",
    "VER": "v2.0.11",
    "DATE": "(02/20/2025)",
    "AUTHOR": "Owen Bowden"
};
// DON'T FORGET TO CHANGE THE VER FILE TOO
const version_info = document.querySelector("#version-info");
version_info.textContent = `${config.VER} ${config.DATE} ${config.AUTHOR}`;
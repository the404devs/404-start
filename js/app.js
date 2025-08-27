const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);


function fadeIn(elem, duration = 400, display = 'block') {
  elem.style.opacity = 0;
  elem.style.display = 'block';

  let start = null;
  function animate(timestamp) {
    if (!start) start = timestamp;
    let progress = (timestamp - start) / duration;
    if (progress > 1) progress = 1;

    elem.style.opacity = progress;

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  }
  requestAnimationFrame(animate);
}

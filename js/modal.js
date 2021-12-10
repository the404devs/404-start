function showModal(id) {
    $('#main').css('filter', 'blur(25px)');
    // $('#c').css('filter','blur(25px)');
    $('#header').css('filter', 'blur(25px)');
    $('#header').css('backdrop-filter', 'none');
    $('#header').css('-webkit-backdrop-filter', 'none');
    $('#xkcd-zone').css('filter', 'blur(25px)');
    $('#xkcd-zone').css('backdrop-filter', 'none');
    $('#xkcd-zone').css('-webkit-backdrop-filter', 'none');
    $(id).fadeIn();
    $(id).css('filter', 'none');
}

function hideModal(id) {
    $('#main').css('filter', 'none');
    // $('#c').css('filter','blur(5px)');
    $('#header').css('filter', 'none');
    $('#header').css('backdrop-filter', 'blur(10px)');
    $('#header').css('-webkit-backdrop-filter', 'blur(10px)');
    $('#xkcd-zone').css('filter', 'none');
    $('#xkcd-zone').css('backdrop-filter', 'blur(10px)');
    $('#xkcd-zone').css('-webkit-backdrop-filter', 'blur(10px)');
    $(".modal").fadeOut();
}

$(document).keyup(function(e) {
    if (e.key === "Escape") {
        hideModal();
    }
});
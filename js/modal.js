function showModal(id) {
    $('#main').css('filter', 'blur(25px)');
    // $('#c').css('filter','blur(25px)');
    $('#header').css('filter', 'blur(25px)');
    $('#header').css('backdrop-filter', 'none');
    $('#header').css('-webkit-backdrop-filter', 'none');
    // $('#xkcd-zone').css('filter', 'blur(25px)');
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
    $(".modal").fadeOut();
}

$(document).keyup(function(e) {
    if (e.key === "Escape") {
        hideModal();
    }
});
function showModal(id) {
    $('#main-content').css('filter', 'blur(25px)');
    // $('#c').css('filter','blur(25px)');
    $('#header').css('filter', 'blur(25px)');
    $('#xkcd-zone').css('filter', 'blur(25px)');
    $(id).fadeIn();
    $(id).css('filter', 'none');
    if (id == "#login-window" || id == "#register-window") {
        $("#config-window").css("filter", "blur(5px)");
    }
}

function hideModal(id) {
    $('#main-content').css('filter', 'none');
    // $('#c').css('filter','blur(5px)');
    $('#header').css('filter', 'none');
    $('#xkcd-zone').css('filter', 'none');
    $(".modal").fadeOut();
}
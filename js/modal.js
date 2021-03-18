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

    if (id == "#login-window") {
        $("#errmsg1").css("opacity", "0");
        setTimeout(() => {
            $("#login-email").val("");
            $("#login-pass").val("");
            $("#errmsg1").text("bruh");
        }, 500);
    } else if (id == "#register-window") {
        $("#errmsg2").css("opacity", "0");
        setTimeout(() => {
            $("#reg-email").val("");
            $("#reg-pass").val("");
            $("#errmsg2").text("bruh");
        }, 500);
    }
}
// Simple modal-related functions
let currentModal = null;

function showModal(id) {
    // Hide everything that needs to be hidden
    $('#main').css('filter', 'blur(25px)');
    // $('#c').css('filter','blur(25px)');
    $('#header').css('filter', 'blur(25px)');
    $('#header').css('backdrop-filter', 'none');
    $('#header').css('-webkit-backdrop-filter', 'none');
    $('#xkcd-zone').css('filter', 'blur(25px)');
    $('#xkcd-zone').css('backdrop-filter', 'none');
    $('#xkcd-zone').css('-webkit-backdrop-filter', 'none');
    // Show the modal
    $(id).fadeIn();
    $(id).css('filter', 'none');
    $(id).css('backdrop-filter', 'blur(10px)');
    currentModal = id;
}

function hideModal() {
    // Unhide everything that needs to be unhidden
    $('#main').css('filter', 'none');
    // $('#c').css('filter','blur(5px)');
    $('#header').css('filter', 'none');
    $('#header').css('backdrop-filter', 'blur(10px)');
    $('#header').css('-webkit-backdrop-filter', 'blur(10px)');
    $('#xkcd-zone').css('filter', 'none');
    $('#xkcd-zone').css('backdrop-filter', 'blur(10px)');
    $('#xkcd-zone').css('-webkit-backdrop-filter', 'blur(10px)');
    // Unshow the modals. All of them.
    $(".modal").fadeOut();
    currentModal = null;
}

// Let the user press escape to close modals
$(document).keyup(function(e) {
    if (e.key === "Escape") {
        if (currentModal === "#config-window") {
            warnUnsavedChanges();
        } else {
            hideModal();
        }
    }
});
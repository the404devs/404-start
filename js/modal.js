// Simple modal-related functions
let currentModal = null;

function showModal(id) {
    // Hide everything that needs to be hidden
    $('#main').style.filter = 'blur(25px)';
    $('#header').style.filter = 'blur(25px)';
    $('#header').style.backdropFilter = 'none';
    $('#xkcd-zone').style.backdropFilter = 'none';
    $('#xkcd-zone').style.filter = 'blur(25px)';
    
    // Show the modal
    const modal = $(id);
    modal.style.filter = 'none'
    modal.style.backdropFilter = 'blur(10px)';
    fadeIn(modal);
    currentModal = id;
}

function hideModal() {
    // Unhide everything that needs to be unhidden
    $('#main').style.filter = 'none';
    $('#header').style.filter = 'none';
    $('#header').style.backdropFilter = 'blur(10px)';
    $('#xkcd-zone').style.backdropFilter = 'blur(10px)';
    $('#xkcd-zone').style.filter = 'none';
    // Unshow the modals. All of them.
    $$('.modal').forEach(modal => {
       fadeOut(modal);
    });
    currentModal = null;
}

// Let the user press escape to close modals
window.addEventListener('keyup', function(e) {
    if (e.key === "Escape") {
        if (currentModal === "#config-window") {
            warnUnsavedChanges();
        } else {
            hideModal();
        }
    }
});

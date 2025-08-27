// Simple modal-related functions
let currentModal = null;

function showModal(id) {
    // Show the modal
    const modal = $(id);
    fadeIn(modal);
    currentModal = id;
}

function hideModal() {
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

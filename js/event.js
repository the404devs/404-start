function showModal(id) {
    $('.row').css('filter', 'blur(25px)');
    // $('#c').css('filter','blur(25px)');
    $('#header').css('filter', 'blur(25px)');
    $('#xkcd-zone').css('filter', 'blur(25px)');
    $(id).fadeIn();
    $(id).css('filter', 'none');
}

function hideModal() {
    $('#eventModal').css('filter', 'blur(5px)');
    $('#alertModal1').css('filter', 'blur(5px)');
    $('#alertModal2').css('filter', 'blur(5px)');
    $('.row').css('filter', 'none');
    // $('#c').css('filter','blur(5px)');
    $('#header').css('filter', 'none');
    $('#xkcd-zone').css('filter', 'none');
    $('#eventModal').fadeOut();
    $('#alertModal1').fadeOut();
    $('#alertModal2').fadeOut();
}
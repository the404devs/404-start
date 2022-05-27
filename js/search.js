const engineURLS = {
    duckduckgo: 'https://duckduckgo.com/?q=',
    google: 'https://www.google.com/search?q=',
    bing: 'https://www.bing.com/search?q='
};

function search() {
    const query = $('#search-input').val();
    const engine = $('#search-engine-selector').val();
    const url = engineURLS[engine] + query;
    window.open(url);
}

$('#search-input').keypress(function(e) {
    if (e.which == 13) {
        search();
    }
});
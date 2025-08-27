const engineURLS = {
    duckduckgo: 'https://duckduckgo.com/?q=',
    google: 'https://www.google.com/search?q=',
    bing: 'https://www.bing.com/search?q='
};

function search() {
    const query = $('#search-input').value;
    const engine = $('#search-engine-selector').value;
    const url = engineURLS[engine] + query;
    if (query && query.replace(/\s+/g, '')) {
        window.open(url);
        $('#search-input').value = '';
    }
}

$('#search-input').addEventListener('keydown', function(e) {
    if (e.which == 13) {
        search();
    }
});

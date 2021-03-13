chrome.tabs.getCurrent(function(tab) {
    chrome.tabs.update(tab.id, { url: "https://start.the404.nl/" });
});
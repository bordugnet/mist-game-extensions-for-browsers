//inject require.js lib script on page which will execute init.js which will load all modules in content-page scope in async mode
$(document).ready(function() {
    var link = document.createElement("script");
    link.src = chrome.runtime.getURL('js/libs/require.js');
    link.type = "text/javascript";
    link.dataset.main = chrome.runtime.getURL('init_v2.js');
    document.getElementsByTagName("head")[0].appendChild(link);
});

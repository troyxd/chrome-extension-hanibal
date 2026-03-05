chrome.tabs.onUpdated.addListener((tabId, tab) => {
  if (tab.url && tab.url.includes("hanibal.cz")) {
    chrome.tabs.sendMessage(tabId, {
      type: "NEW",
    });
  }
});

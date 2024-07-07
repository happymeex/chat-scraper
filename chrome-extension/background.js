chrome.action.onClicked.addListener((tab) => {
  if (tab.url.startsWith("https://www.messenger.com/")) {
    chrome.tabs.sendMessage(tab.id, { message: "chat-scraper-init" });
  }
});

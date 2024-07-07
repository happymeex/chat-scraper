chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  // Send a message to the content script
  chrome.tabs.sendMessage(tabs[0].id, { action: "chat-scraper-init" });
});

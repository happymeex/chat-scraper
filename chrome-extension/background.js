chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.sendMessage(tab.id, { message: "chat-scraper-init" }, (res) => {
    const lastError = chrome.runtime.lastError;
    // Ignore errors from trying to trigger the scraper on a non-Messenger tab
    if (
      !lastError?.message
        ?.toLowerCase()
        .includes("receiving end does not exist")
    ) {
      console.error(error);
    }
  });
});

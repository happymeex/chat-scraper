import main from "./core/main";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "chat-scraper-init") {
    main();
  }
  sendResponse({});
});

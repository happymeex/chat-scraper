import main from "./core/main";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "chat-scraper-init") {
    main();
  }
});

import initializeScraper from "./core/scrape";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "chat-scraper-init") {
    initializeScraper();
  }
});

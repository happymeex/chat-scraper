import { getChatNameAndMessageDiv } from "./scraper";
import { writeJSONToNewWindow } from "./utils";
import {
  getMessageContent,
  isMessageDiv,
  Message,
  MessageParseStatus,
  isProfileBanner,
} from "./messageParser";
import { makeScraperPanel } from "./panel";

const POLLING_TIME = 400;

function main() {
  const panel = makeScraperPanel();
  if (!panel) {
    return;
  }
  const { startScrape, stopScrape } = scrapeFactory(
    (chatName: string) => {
      panel.setCurrentChatName(chatName);
    },
    () => {
      panel.setIdle();
      panel.showExportOptions();
    }
  );
  panel.setStartScrapeHandler(startScrape);
  panel.setStopScrapeHandler(stopScrape);
  panel.display();
}

/**
 * @param handleStartScrapeUI function to be called when the system
 * initiates the scrape, in order to sync the UI
 * @param handleStopScrapeUI function to be called when the system
 * terminates the scrape, in order to sync the UI
 * @returns
 */
function scrapeFactory(
  handleStartScrapeUI: (chatName: string) => void = () => {},
  handleStopScrapeUI: () => void = () => {}
): {
  /** Function to start the scrape when the user initiates it. */
  startScrape: () => void;
  /** Function to stop the scrape when the user terminates it. */
  stopScrape: () => void;
} {
  let chatName: string | null = null;
  let processedMessages: (Message | null)[] = [];

  let scrapeProcess: number | null = null;
  const startScrape = () => {
    const chatNameAndMessageDiv = getChatNameAndMessageDiv();
    if (!chatNameAndMessageDiv) {
      console.log("Chat not found!");
      return;
    }
    const { chatName: name, messageDiv } = chatNameAndMessageDiv;
    chatName = name;
    handleStartScrapeUI(chatName);
    const processedDivs = new Set<Element>();
    let currentDivToProcess = messageDiv.lastElementChild;
    console.log("Scraping...");
    // Returns true if should terminate, otherwise false
    const tryMovingToPreviousSiblingMessageDiv = () => {
      if (currentDivToProcess === null) {
        return true;
      }
      const prevSibling = currentDivToProcess.previousElementSibling;
      if (prevSibling === null) {
        return true;
      } else if (!isMessageDiv(prevSibling)) {
        if (isProfileBanner(prevSibling)) {
          return true;
        }
        prevSibling.scrollIntoView(false);
        return false;
      } else {
        currentDivToProcess = prevSibling;
        return false;
      }
    };

    // Returns true if should terminate, otherwise false
    const processLastMessage = () => {
      if (currentDivToProcess === null) {
        return true;
      }
      const [message, status] = getMessageContent(currentDivToProcess);
      if (
        status === MessageParseStatus.NOT_A_MESSAGE ||
        status === MessageParseStatus.TERMINATE
      ) {
        return true;
      }
      if (
        status === MessageParseStatus.EMPTY_MESSAGE ||
        processedDivs.has(currentDivToProcess)
      ) {
        if (tryMovingToPreviousSiblingMessageDiv()) return true;
        return false;
      } else {
        processedMessages.push(message);
        processedDivs.add(currentDivToProcess);
        if (tryMovingToPreviousSiblingMessageDiv()) return true;
        return false;
      }
    };

    const process = setInterval(() => {
      if (processLastMessage()) {
        writeJSONToNewWindow(processedMessages);
        console.log("Done!");
        clearInterval(process);
        handleStopScrapeUI();
        processedMessages = [];
        chatName = null;
      }
    }, POLLING_TIME);
    scrapeProcess = process;
  };

  const stopScrape = () => {
    if (scrapeProcess) {
      writeJSONToNewWindow(processedMessages);
      console.log("Stopped scraping!");
      clearInterval(scrapeProcess);
      handleStopScrapeUI();
      scrapeProcess = null;
      processedMessages = [];
      chatName = null;
    }
  };

  return { startScrape, stopScrape };
}

main();

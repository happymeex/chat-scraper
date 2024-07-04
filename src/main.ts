import { getScrollableAndMessageContainer } from "./scraper";
import { writeJSONToNewWindow } from "./utils";
import {
  getMessageContent,
  isMessageDiv,
  Message,
  MessageParseStatus,
  isProfileBanner,
} from "./messageParser";
import { makeUIPanel } from "./ui";

const POLLING_TIME = 600;

function main() {
  const { startScrape, stopScrape } = scrapeFactory();
  makeUIPanel(startScrape, stopScrape);
}

function scrapeFactory() {
  const processedMessages: (Message | null)[] = [];

  let scrapeProcess: number | null = null;
  const startScrape = () => {
    const messageDiv = getScrollableAndMessageContainer();
    const processedDivs = new Set<Element>();
    if (!messageDiv) {
      console.log("Chat not found!");
      return;
    }
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
        console.log(processedMessages);
        writeJSONToNewWindow(processedMessages);
        console.log("Done!");
        clearInterval(process);
      }
    }, POLLING_TIME);
    scrapeProcess = process;
  };

  const stopScrape = () => {
    if (scrapeProcess) {
      writeJSONToNewWindow(processedMessages);
      console.log("Stopped scraping!");
      clearInterval(scrapeProcess);
      scrapeProcess = null;
    }
  };

  return { startScrape, stopScrape };
}

main();

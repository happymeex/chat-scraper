import { getScrollableAndMessageContainer } from "./scraper";
import { writeToNewWindow } from "./utils";
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
  const { scrollContainer, messageDiv } = getScrollableAndMessageContainer();
  const processedMessages: (Message | null)[] = [];
  const processedDivs = new Set<Element>();
  let currentDivToProcess = messageDiv.lastElementChild;

  let scrapeProcess: number | null = null;
  const startScrape = () => {
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
      if (processLastMessage() || window.innerWidth < 768) {
        console.log(processedMessages);
        writeToNewWindow(JSON.stringify(processedMessages));
        console.log("Done!");
        clearInterval(process);
      }
    }, POLLING_TIME);
    scrapeProcess = process;
  };

  const stopScrape = () => {
    if (scrapeProcess) {
      writeToNewWindow(JSON.stringify(processedMessages));
      console.log("Stopped scraping!");
      clearInterval(scrapeProcess);
      scrapeProcess = null;
    }
  };

  return { startScrape, stopScrape };
}
function scrapeCurrentChat() {
  const { scrollContainer, messageDiv } = getScrollableAndMessageContainer();
  const processedMessages: (Message | null)[] = [];
  const processedDivs = new Set<Element>();
  let currentDivToProcess = messageDiv.lastElementChild;

  let scrapeProcess: number | null = null;
  const startScrape = () => {
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
      if (processLastMessage() || window.innerWidth < 768) {
        console.log(processedMessages);
        writeToNewWindow(JSON.stringify(processedMessages));
        console.log("Done!");
        clearInterval(process);
      }
    }, POLLING_TIME);
    scrapeProcess = process;
  };

  const stopScrape = () => {
    if (scrapeProcess) {
      writeToNewWindow(JSON.stringify(processedMessages));
      console.log("Stopped scraping!");
      clearInterval(scrapeProcess);
      scrapeProcess = null;
    }
  };

  return { startScrape, stopScrape };
}

main();

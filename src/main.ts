import { getChatNameAndMessageDiv } from "./scraper";
import { downloadJSONFile, writeJSONToNewWindow } from "./utils";
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
  const { startScrape, stopScrape } = scrapeFactory({
    handleStartScrapeUI: (chatName: string) => {
      panel.setCurrentChatName(chatName);
    },
    handleStopScrapeUI: (downloader, windowOpener) => {
      panel.setIdle();
      panel.showExportOptions();
      panel.setDownloadHandler(downloader);
      panel.setOpenInNewWindowHandler(windowOpener);
    },
  });
  panel.setStartScrapeHandler(startScrape);
  panel.setStopScrapeHandler(stopScrape);
  panel.display();
}

interface ScrapeFactoryParams {
  /**
   * function to trigger UI changes when the system starts the scrape
   */
  handleStartScrapeUI: (chatName: string) => void;
  /**
   * function to trigger UI changes when the system finishes scraping
   */
  handleStopScrapeUI: (
    downloader: (format: "json" | "text") => void,
    windowOpener: (format: "json" | "text") => void
  ) => void;
}

/**
 * @param handleStartScrapeUI
 * @param handleStopScrapeUI function to trigger UI changes
 * when the system stops the scrape
 */
function scrapeFactory({
  handleStartScrapeUI,
  handleStopScrapeUI,
}: ScrapeFactoryParams): {
  /** Function to trigger system to scrape when the user initiates it. */
  startScrape: () => void;
  /** Function to trigger system to terminate scrape when the user stops it. */
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
        handleStopScrapeUI(
          (format) => {
            console.log("Downloading format", format);
            if (format === "json") {
              downloadJSONFile(processedMessages);
            } else return;
          },
          (format) => {
            console.log("Opening window format", format);
            if (format === "json") {
              writeJSONToNewWindow(processedMessages);
            } else return;
          }
        );
        processedMessages = [];
        chatName = null;
      }
    }, POLLING_TIME);
    scrapeProcess = process;
  };

  const stopScrape = () => {
    if (scrapeProcess) {
      writeJSONToNewWindow(processedMessages);
      const messages = processedMessages;
      console.log("Stopped scraping!");
      clearInterval(scrapeProcess);
      handleStopScrapeUI(
        (format) => {
          console.log("Downloading format", format);
          console.log("Number of messages: ", messages.length);
          if (format === "json") {
            downloadJSONFile(messages);
          } else return;
        },
        (format) => {
          console.log("Opening window format", format);
          console.log("Number of messages: ", messages.length);
          if (format === "json") {
            writeJSONToNewWindow(messages);
          } else return;
        }
      );
      scrapeProcess = null;
      processedMessages = [];
      chatName = null;
    }
  };

  return { startScrape, stopScrape };
}

main();

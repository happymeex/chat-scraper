import { getChatNameAndMessageDiv } from "./scraper";
import {
  downloadJSONFile,
  downloadTextAsFile,
  openHTMLInNewWindow,
  writeJSONToNewWindow,
} from "./utils";
import {
  getMessageContent,
  isMessageDiv,
  isProfileBanner,
} from "./messageParser";
import { makeScraperPanel } from "./panel";
import {
  getHTMLStringFromMessageJSON,
  getRawStringFromMessageJSON,
} from "./format";
import { Exporter, MessageParseStatus, Message } from "./types";

const POLLING_TIME = 5;
const MAX_SIMULTANEOUS_DIVS = 100;

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

type ScrapeFactoryParams = {
  /**
   * Function to trigger UI changes when the system starts the scrape
   */
  handleStartScrapeUI: (chatName: string) => void;
  /**
   * Function to trigger UI changes when the system finishes scraping
   */
  handleStopScrapeUI: (downloader: Exporter, windowOpener: Exporter) => void;
};

type ScrapeFactoryOutput = {
  /** Function to trigger system to scrape when the user initiates it. */
  startScrape: () => void;
  /** Function to trigger system to terminate scrape when the user stops it. */
  stopScrape: () => void;
};

/**
 * @param handleStartScrapeUI
 * @param handleStopScrapeUI function to trigger UI changes
 * when the system stops the scrape
 */
function scrapeFactory({
  handleStartScrapeUI,
  handleStopScrapeUI,
}: ScrapeFactoryParams): ScrapeFactoryOutput {
  let chatName: string | null = null;
  let processedMessages: (Message | null)[] = [];

  let scrapeProcess: number | null = null;
  let currentDivToProcess: Element | null = null;

  const trimDivCount = (messageDiv: HTMLElement, eltSet: Set<Element>) => {
    if (messageDiv.children.length > MAX_SIMULTANEOUS_DIVS) {
      const numDivsToRemove = MAX_SIMULTANEOUS_DIVS / 2;
      for (let i = 0; i < numDivsToRemove; i++) {
        const lastDiv = messageDiv.lastElementChild;
        if (lastDiv) {
          eltSet.delete(lastDiv);
          messageDiv.removeChild(lastDiv);
        }
      }
    }
  };

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
  const processLastMessage = (processedDivs: Set<Element>) => {
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
  const startScrape = () => {
    const chatNameAndMessageDiv = getChatNameAndMessageDiv();
    if (!chatNameAndMessageDiv) {
      handleStopScrapeUI(
        () => {},
        () => {}
      );
      return;
    }
    const { chatName: name, messageDiv } = chatNameAndMessageDiv;
    chatName = name;
    handleStartScrapeUI(chatName);
    const processedDivs = new Set<Element>();
    currentDivToProcess = messageDiv.lastElementChild;

    const process = setInterval(() => {
      trimDivCount(messageDiv, processedDivs);
      if (processLastMessage(processedDivs)) {
        const messages = processedMessages.reverse();
        const chatNameString = chatName ?? "";
        clearInterval(process);
        handleStopScrapeUI(...exporterFactory(chatNameString, messages));
        processedMessages = [];
        chatName = null;
      }
    }, POLLING_TIME);
    scrapeProcess = process;
  };

  const stopScrape = () => {
    if (scrapeProcess) {
      const messages = processedMessages.reverse();
      const chatNameString = chatName ?? "";
      clearInterval(scrapeProcess);
      handleStopScrapeUI(...exporterFactory(chatNameString, messages));
      scrapeProcess = null;
      processedMessages = [];
      chatName = null;
    }
  };

  return { startScrape, stopScrape };
}

function exporterFactory(
  chatName: string,
  messages: (Message | null)[]
): [Exporter, Exporter] {
  const nonNullMessages = messages.filter(
    (message) => message !== null
  ) as Message[];
  const downloader: Exporter = (format) => {
    if (format === "json") {
      downloadJSONFile(chatName, messages);
    } else if (format === "text") {
      downloadTextAsFile(
        chatName,
        getRawStringFromMessageJSON(chatName, nonNullMessages)
      );
    }
  };
  const windowOpener: Exporter = (format) => {
    if (format === "json") {
      writeJSONToNewWindow(messages);
    } else if (format === "text") {
      openHTMLInNewWindow(
        getHTMLStringFromMessageJSON(chatName, nonNullMessages)
      );
    }
  };
  return [downloader, windowOpener];
}

main();

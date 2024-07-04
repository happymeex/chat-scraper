import { getScrollableAndMessageContainer } from "./scraper";
import { scrollUp, writeToNewWindow } from "./utils";
import {
  getMessageContent,
  isMessageDiv,
  Message,
  MessageParseStatus,
} from "./messageParser";

const POLLING_TIME = 600;

function main() {
  const { scrollContainer, messageDiv } = getScrollableAndMessageContainer();
  scrollUp(scrollContainer);
  let activeMessageDivs = Array.from(messageDiv.children);
  const processedMessages: (Message | null)[] = [];

  const processedDivs = new Set<Element>();
  let currentDivToProcess = messageDiv.lastElementChild;
  // Returns true if should terminate, otherwise false

  const tryMovingToPreviousSiblingMessageDiv = () => {
    if (currentDivToProcess === null) {
      return true;
    }
    const prevSibling = currentDivToProcess.previousElementSibling;
    if (prevSibling === null) {
      return true;
    } else if (!isMessageDiv(prevSibling)) {
      prevSibling.scrollIntoView(false);
      return false;
    } else {
      currentDivToProcess = prevSibling;
      return false;
    }
  };
  const processLastMessage = () => {
    if (currentDivToProcess === null) {
      return true;
    }
    const [message, status] = getMessageContent(currentDivToProcess);
    if (status === MessageParseStatus.NOT_A_MESSAGE) {
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
}

main();

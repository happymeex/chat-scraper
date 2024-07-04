import { getScrollableAndMessageContainer } from "./scraper";
import { scrollUp, writeToNewWindow } from "./utils";
import {
  getMessageContent,
  Message,
  MessageParseStatus,
} from "./messageParser";

const POLLING_TIME = 1000;

function main() {
  const { scrollContainer, messageDiv } = getScrollableAndMessageContainer();
  scrollUp(scrollContainer);
  let activeMessageDivs = Array.from(messageDiv.children);
  const processedMessages: (Message | null)[] = [];

  let currentDivToProcess = messageDiv.lastElementChild;
  // Returns true if should terminate, otherwise false
  const processLastMessage = () => {
    console.log("processing message");
    if (currentDivToProcess === null) {
      console.log("null now");
      return true;
    }
    const [message, status] = getMessageContent(currentDivToProcess);
    if (status === MessageParseStatus.NOT_A_MESSAGE) {
      console.log("Not a message");
      return true;
    }
    if (status === MessageParseStatus.EMPTY_MESSAGE) {
      // out of view
      currentDivToProcess.scrollIntoView();
      console.log("wait! empty message");
      return false;
    } else {
      console.log("Processed message: ", message);
      processedMessages.push(message);
      currentDivToProcess = currentDivToProcess.previousElementSibling;
      return false;
    }
  };

  const process = setInterval(() => {
    if (processLastMessage()) {
      clearInterval(process);
      writeToNewWindow(JSON.stringify(processedMessages));
      console.log("Done!");
    }
  }, POLLING_TIME);
}

main();

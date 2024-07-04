import { getScrollableAndMessageContainer } from "./scraper";
import { scrollUp, writeToNewWindow } from "./utils";
import { getMessageContent, Message } from "./messageParser";

const POLLING_TIME = 1000;

function main() {
  const { scrollContainer, messageDiv } = getScrollableAndMessageContainer();
  console.log(scrollContainer);
  scrollUp(scrollContainer);
  console.log(messageDiv);
  let activeMessageDivs = Array.from(messageDiv.children);
  const processedMessages: (Message | null)[] = [];
  const processMessages = () => {
    const tempProcessedMessages: (Message | null)[] = [];
    const messages = activeMessageDivs.map(getMessageContent);
    let earliestValidMessageIndex = messages.length;
    for (let i = messages.length - 1; i >= 0; i--) {
      const message = messages[i];
      if (messages[i]) {
        earliestValidMessageIndex = i;
      }
      tempProcessedMessages.unshift(message);
    }
    processedMessages.push(
      ...tempProcessedMessages.slice(earliestValidMessageIndex).reverse()
    );
    activeMessageDivs.slice(earliestValidMessageIndex).forEach((div) => {
      div.remove();
    });
  };

  processMessages();
  const hydrateActiveMessages = () => {
    activeMessageDivs = Array.from(messageDiv.children);
  };
  const output = JSON.stringify(processedMessages, null, 2);
  writeToNewWindow(output);
  console.log(output);
}

main();

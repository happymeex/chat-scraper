import { getScrollableAndMessageContainer } from "./scraper";
import { scrollUp, writeToNewWindow } from "./utils";
import { getMessageContent } from "./messageParser";

function main() {
  const { scrollContainer, messageDiv } = getScrollableAndMessageContainer();
  console.log(scrollContainer);
  scrollUp(scrollContainer);
  console.log(messageDiv);
  const output = JSON.stringify(
    Array.from(messageDiv.children).map(getMessageContent)
  );
  console.log(output);
  writeToNewWindow(output);
}

main();

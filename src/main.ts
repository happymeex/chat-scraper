import { getScrollableAndMessageContainer } from "./scraper";
import { scrollUp } from "./utils";
import { getMessageContent } from "./messageParser";
function main() {
  const { scrollContainer, messageDiv } = getScrollableAndMessageContainer();
  console.log(scrollContainer);
  scrollUp(scrollContainer);
  console.log(messageDiv);
  for (let message of Array.from(messageDiv.children)) {
    const allText = getMessageContent(message);
    console.log(allText);
  }
}

main();

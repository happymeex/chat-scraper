import { getScrollableAndMessageContainer } from "./scraper";
import { scrollUp } from "./utils";
import { getAllText } from "./messageParser";
function main() {
  const { scrollContainer, messageDiv } = getScrollableAndMessageContainer();
  console.log(scrollContainer);
  scrollUp(scrollContainer);
  console.log(messageDiv);
  for (let message of Array.from(messageDiv.children)) {
    const allText = getAllText(message);
    console.log(allText);
  }
}

main();

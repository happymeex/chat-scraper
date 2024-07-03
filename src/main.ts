import { getScrollableAndMessageContainer } from "./scraper";
import { scrollUp } from "./utils";
function main() {
  const { scrollContainer, messageDiv } = getScrollableAndMessageContainer();
  console.log(scrollContainer);
  scrollUp(scrollContainer);
  console.log(messageDiv);
}

main();

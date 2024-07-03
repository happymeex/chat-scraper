/**
 *
 * @returns div containing the message panel
 */
function findMessageDiv(): HTMLElement | null {
  return findFirstDescendant(document.body, false, (elt) => {
    const ariaLabel = elt.getAttribute("aria-label");
    if (!ariaLabel) return false;
    return ariaLabel.startsWith("Messages in conversation ");
  });
}

/**
 * Given the message panel div, finds the scrollable message container within it
 *
 * @param domElement
 */
function findScrollableMessageContainer(
  domElement: HTMLElement
): HTMLElement | null {
  return findFirstDescendant(domElement, false, (elt) => {
    return (
      getComputedStyle(elt).overflowY === "auto" &&
      elt.getAttribute("role") === "grid"
    );
  });
}

/**
 * Finds the first HTML descendant of the given element that matches the given validator.
 *
 * @param domElement the element
 * @param includeSelf true if the element itself should be included
 * @param validator a function that returns true if the element matches
 * @returns
 */
function findFirstDescendant(
  domElement: Element,
  includeSelf: boolean,
  validator: (elt: HTMLElement) => boolean
): HTMLElement | null {
  if (domElement instanceof HTMLElement && includeSelf && validator(domElement))
    return domElement;
  for (let child of domElement.children) {
    const result = findFirstDescendant(child, true, validator);
    if (result) return result;
  }
  return null;
}

/**
 * Scrolls the given view of the given container to the top.
 */
function scrollUp(scrollContainer: HTMLElement) {
  scrollContainer.scrollTop = 0;
}

function getScrollableAndMessageContainer(): {
  /** Scrollable div that contains all the messages */
  scrollContainer: HTMLElement;
  /** Direct parent of all the messages */
  messageDiv: HTMLElement;
} {
  const outerContainer = findMessageDiv();
  if (!outerContainer) {
    throw new Error("Could not find message container");
  }
  const scrollContainer = findScrollableMessageContainer(outerContainer);
  if (!scrollContainer) {
    throw new Error("Could not find scrollable message container");
  }
  const messageDiv = scrollContainer.firstElementChild;
  if (!(messageDiv instanceof HTMLElement)) {
    throw new Error("Could not find message div");
  }
  return { scrollContainer, messageDiv };
}

function main() {
  const { scrollContainer, messageDiv } = getScrollableAndMessageContainer();
  console.log(scrollContainer);
  scrollUp(scrollContainer);
  console.log(messageDiv);
}

main();

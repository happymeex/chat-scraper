import { findFirstDescendant } from "./utils";

/**
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

export function getScrollableAndMessageContainer(): {
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

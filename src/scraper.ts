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

/**
 * @returns The div that contains all the messages, or null if not found
 */
export function getScrollableAndMessageContainer(): HTMLElement | null {
  const outerContainer = findMessageDiv();
  if (!outerContainer) {
    return null;
  }
  const scrollContainer = findScrollableMessageContainer(outerContainer);
  if (!scrollContainer) {
    return null;
  }
  const messageDiv = scrollContainer.firstElementChild;
  if (!(messageDiv instanceof HTMLElement)) {
    return null;
  }
  return messageDiv;
}

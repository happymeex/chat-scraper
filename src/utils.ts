/**
 * Scrolls the given view of the given container to the top.
 */
export function scrollUp(scrollContainer: HTMLElement) {
  scrollContainer.scrollTop = 0;
}

/**
 * Finds the first HTML descendant of the given element that matches the given validator.
 *
 * @param domElement the element
 * @param includeSelf true if the element itself should be included
 * @param validator a function that returns true if the element matches
 * @returns
 */
export function findFirstDescendant(
  domElement: Element,
  includeSelf: boolean,
  validator: (elt: HTMLElement) => boolean
): HTMLElement | null {
  if (domElement instanceof HTMLElement && includeSelf && validator(domElement))
    return domElement;
  for (let child of Array.from(domElement.children)) {
    const result = findFirstDescendant(child, true, validator);
    if (result) return result;
  }
  return null;
}

/**
 * Opens a new window and writes the given text to it.
 *
 * @throws if the window cannot be opened
 */
export function writeToNewWindow(text: string) {
  const win = window.open("about:blank", "_blank");
  if (win) {
    win.document.write(text);
    win.document.close();
  } else {
    throw new Error("Could not open new window");
  }
}

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

export function writeJSONToNewWindow(jsonObject: any) {
  const jsonString = JSON.stringify(jsonObject, null, 2);
  const jsonBlob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(jsonBlob);
  window.open(url, "_blank");

  // revoke the object URL after a delay to release memory
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
}

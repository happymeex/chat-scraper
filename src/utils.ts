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

export function downloadJSONFile(jsonObject: any) {
  const jsonString = JSON.stringify(jsonObject, null, 2);
  const jsonBlob = new Blob([jsonString], { type: "application/json" });
  const downloadLink = document.createElement("a");
  const url = URL.createObjectURL(jsonBlob);
  downloadLink.href = url;
  downloadLink.download = "chat-scraper-output.json";
  downloadLink.click();

  // revoke the object URL after a delay to release memory
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 5000);
}

export function addRadioInput(
  holder: HTMLDivElement,
  label: string,
  name: string,
  value: string,
  isSelected: boolean,
  onChange: () => void
) {
  const input = document.createElement("input");
  input.type = "radio";
  input.name = name;
  input.value = value;
  input.onchange = onChange;
  input.checked = isSelected;
  const labelElement = document.createElement("label");
  labelElement.style.display = "flex";
  labelElement.style.alignItems = "center";
  labelElement.style.gap = "2px";
  labelElement.appendChild(input);
  labelElement.append(label);
  holder.appendChild(labelElement);
}

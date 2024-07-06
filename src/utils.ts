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

  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 5000);
}

export function downloadJSONFile(rawFilename: string, jsonObject: any) {
  const fileName = sanitizeFilename(rawFilename) + ".json";
  const jsonString = JSON.stringify(jsonObject, null, 2);
  const jsonBlob = new Blob([jsonString], { type: "application/json" });
  const downloadLink = document.createElement("a");
  const url = URL.createObjectURL(jsonBlob);
  downloadLink.href = url;
  downloadLink.download = fileName;
  downloadLink.click();

  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 5000);
}

export function openHTMLInNewWindow(html: string) {
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank");
}

export function downloadTextAsFile(rawFilename: string, text: string) {
  const fileName = sanitizeFilename(rawFilename) + ".txt";
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.download = fileName;
  downloadLink.click();

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

export function sanitizeFilename(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\-_.]/g, "-")
    .replace(/\-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function sanitizeText(text: string) {
  return text
    .replace(/’/g, "'")
    .replace(/‘/g, "'")
    .replace(/“/g, '"')
    .replace(/”/g, '"');
}

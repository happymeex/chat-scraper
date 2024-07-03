enum TextType {
  REACT_COUNT,
  MESSAGE_BODY,
  ADDRESS_INFO,
  REPLY_INFO,
  ENTER,
  TIME,
  UNSPECIFIED,
}

type TextLabel = {
  type: TextType;
  text: string;
};

export function getAllText(node: Node): TextLabel[] {
  const textLabels = getAllTextIncompleteLabels(node);
  // TODO: Parse the rest of the labels
  return textLabels;
}

function getAllTextIncompleteLabels(node: Node): TextLabel[] {
  if (node instanceof Text) {
    const parentElt = node.parentElement;
    let textType: TextType = TextType.UNSPECIFIED;
    if (parentElt) {
      if (
        parentElt.getAttribute("role") === "none" &&
        parentElt.style.width === "1ch"
      ) {
        textType = TextType.REACT_COUNT;
      } else if (node.data === "Enter") {
        textType = TextType.ENTER;
      } else if (node.data === "Original message:") {
        textType = TextType.REPLY_INFO;
      }
    }

    if (textType === TextType.ENTER) return [];
    return [{ type: textType, text: node.data }];
  }
  if (node instanceof Element) {
    return Array.from(node.childNodes).flatMap(getAllText);
  }
  return [];
}

enum TextType {
  REACT_COUNT,
  MESSAGE_BODY,
  ADDRESS_INFO,
  REPLY_INFO,
  ENTER,
  TIME,
  UNSPECIFIED,
  SENT_MARKER,
}

type TextLabel = {
  type: TextType;
  text: string;
};

type ReplyInfo = {
  /** Name of person replied to */
  addresseeName: string;
  /** Text of message replied to (or preview thereof) */
  originalMessage: string;
};
export type Message = {
  time: string | null;
  /** Info if this message was a reply, null if not */
  replyInfo: ReplyInfo | null;
  senderName: string;
  body: string;
  isImage: boolean;
};

/**
 * Retrieves the message content from a given Node.
 *
 * @param node the Node containing the message content.
 * @return the extracted message content or null if there was an error.
 */
export function getMessageContent(node: Node): Message | null {
  const textLabels = getMessageTextIncompleteLabels(node);

  if (textLabels.length === 0) return null;

  if (textLabels.length === 1) {
    const senderName = textLabels[0].text;
    return {
      time: null,
      replyInfo: null,
      senderName: senderName === "You sent" ? "You" : senderName,
      body: "",
      isImage: true,
    };
  }

  const messageBody = textLabels[textLabels.length - 1].text;
  textLabels.pop();

  let senderName: string | null = null;
  let replyInfo: ReplyInfo | null = null;
  // check if it's a reply by getting index of "Original message:"
  const repliedTo = textLabels.findIndex(
    (label) => label.type === TextType.REPLY_INFO
  );
  if (repliedTo === 0) return null; // reply missing sender/addressee info
  if (repliedTo > 0) {
    let addresseeName: string | null = null;
    // regex to extract the sender and addressee
    const rx = RegExp("^(.*) replied to (.*)$");
    const match = textLabels[repliedTo - 1].text.match(rx);
    if (match) {
      senderName = match[1];
      addresseeName = match[2];
    }
    if (addresseeName === null || senderName === null) {
      return null;
    }
    const originalMessage = textLabels
      .splice(repliedTo + 1) // avoid "Original message:"
      .map((label) => label.text)
      .join("");

    textLabels.pop(); // remove "Original message:"
    textLabels.pop(); // remove "X replied to Y"

    replyInfo = {
      addresseeName,
      originalMessage,
    };
  } else {
    if (textLabels.length === 0) return null;
    senderName = textLabels[textLabels.length - 1].text;
    senderName = senderName === "You sent" ? "You" : senderName;
    textLabels.pop();
  }

  let time = null;
  if (textLabels.length !== 0) {
    time = textLabels[textLabels.length - 1].text;
  }

  return {
    time,
    replyInfo,
    senderName,
    body: messageBody,
    isImage: false,
  };
}

function getMessageTextIncompleteLabels(node: Node): TextLabel[] {
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
      } else if (
        node.data.startsWith("Sent") &&
        parentElt instanceof HTMLSpanElement
      ) {
        textType = TextType.SENT_MARKER;
      }
    }

    if (
      textType === TextType.ENTER ||
      textType === TextType.REACT_COUNT ||
      textType === TextType.SENT_MARKER
    )
      return [];
    return [{ type: textType, text: node.data }];
  }
  if (node instanceof Element) {
    return Array.from(node.childNodes).flatMap(getMessageTextIncompleteLabels);
  }
  return [];
}

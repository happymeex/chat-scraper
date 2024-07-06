import { MessageParseStatus, Message, ReplyInfo } from "./types";

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

/**
 * Retrieves the message content from a given element.
 *
 * @param elt the element containing the message content.
 * @return the extracted message content or null if there was an error.
 */
export function getMessageContent(
  elt: Element
): [Message | null, MessageParseStatus] {
  if (!isMessageDiv(elt)) return [null, MessageParseStatus.NOT_A_MESSAGE];
  const textLabels = getMessageTextIncompleteLabels(elt);

  let time: string | null = null;
  while (textLabels.length > 0 && textLabels[0].type === TextType.TIME) {
    time = textLabels[0].text;
    textLabels.shift();
  }

  if (textLabels.length === 0) return [null, MessageParseStatus.EMPTY_MESSAGE];

  if (textLabels.length === 1) {
    const text = textLabels[0].text;
    if (text === "You are now connected on Messenger")
      return [null, MessageParseStatus.TERMINATE];
    return [
      {
        time,
        replyInfo: null,
        sender: text === "You sent" ? "You" : text,
        body: "",
        isImage: true,
      },
      MessageParseStatus.SUCCESS,
    ];
  }

  let senderName: string | null = null;
  let replyInfo: ReplyInfo | null = null;
  // check if it's a reply by getting index of "Original message:"
  const repliedTo = textLabels.findIndex(
    (label) => label.type === TextType.REPLY_INFO
  );
  if (repliedTo === 0) return [null, MessageParseStatus.UNKNOWN_FORMAT]; // reply missing sender/addressee info
  if (repliedTo > 0) {
    let addresseeName: string | null = null;
    // regex to extract the sender and addressee
    const rx = RegExp("^(.*) replied to (.*)$");
    const match = textLabels[0].text.match(rx);
    if (match) {
      senderName = match[1];
      addresseeName = match[2];
    }
    if (addresseeName === null || senderName === null) {
      return [null, MessageParseStatus.UNKNOWN_FORMAT];
    }

    textLabels.shift(); // remove "X replied to Y"
    // remove extra stuff present in edited replies
    while (
      textLabels.length > 0 &&
      textLabels[0].text !== "Original message:"
    ) {
      textLabels.shift();
    }
    if (textLabels.length < 3) return [null, MessageParseStatus.UNKNOWN_FORMAT];
    textLabels.shift(); // remove "Original message:"

    let originalMessage = textLabels[0].text;
    textLabels.shift();
    if (textLabels[0].text === "…") {
      originalMessage += "…";
      textLabels.shift();
    }

    replyInfo = {
      to: addresseeName,
      body: originalMessage,
    };
  } else {
    if (textLabels.length === 0)
      return [null, MessageParseStatus.UNKNOWN_FORMAT];
    senderName = textLabels[0].text;
    senderName = senderName === "You sent" ? "You" : senderName;
    textLabels.shift();
  }

  const messageBody = textLabels.map((label) => label.text).join(" ");

  return [
    {
      time,
      replyInfo,
      sender: senderName,
      body: messageBody,
      isImage: false,
    },
    MessageParseStatus.SUCCESS,
  ];
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
      } else if (parentElt.closest("h3[dir='auto']")) {
        textType = TextType.TIME;
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

export function isMessageDiv(elt: Element): boolean {
  return elt instanceof HTMLDivElement && elt.attributes.length === 0;
}

/**
 * Returns true if the element is a profile banner at the beginning of a chat (termination condition)
 */
export function isProfileBanner(elt: Element): boolean {
  return (
    elt instanceof HTMLDivElement &&
    elt.classList.contains("html-div") &&
    elt.getAttribute("role") === "presentation"
  );
}

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

export enum MessageParseStatus {
  SUCCESS,
  NOT_A_MESSAGE,
  UNKNOWN_FORMAT,
  EMPTY_MESSAGE,
  TERMINATE,
}

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

  if (textLabels.length === 0) return [null, MessageParseStatus.EMPTY_MESSAGE];

  if (textLabels.length === 1) {
    const text = textLabels[0].text;
    if (text === "You are now connected on Messenger")
      return [null, MessageParseStatus.TERMINATE];
    return [
      {
        time: null,
        replyInfo: null,
        senderName: text === "You sent" ? "You" : text,
        body: "",
        isImage: true,
      },
      MessageParseStatus.SUCCESS,
    ];
  }

  const messageBody = textLabels[textLabels.length - 1].text;
  textLabels.pop();

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
    const match = textLabels[repliedTo - 1].text.match(rx);
    if (match) {
      senderName = match[1];
      addresseeName = match[2];
    }
    if (addresseeName === null || senderName === null) {
      return [null, MessageParseStatus.UNKNOWN_FORMAT];
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
    if (textLabels.length === 0)
      return [null, MessageParseStatus.UNKNOWN_FORMAT];
    senderName = textLabels[textLabels.length - 1].text;
    senderName = senderName === "You sent" ? "You" : senderName;
    textLabels.pop();
  }

  let time = null;
  if (textLabels.length !== 0) {
    time = textLabels[textLabels.length - 1].text;
  }

  return [
    {
      time,
      replyInfo,
      senderName,
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

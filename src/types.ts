export type Exporter = (format: "json" | "text") => void;

export enum MessageParseStatus {
  SUCCESS,
  NOT_A_MESSAGE,
  UNKNOWN_FORMAT,
  EMPTY_MESSAGE,
  TERMINATE,
}

export type ReplyInfo = {
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

import { Message } from "./types";

export function getHTMLStringFromMessageJSON(
  chatName: string,
  messages: Message[]
): string {
  const messageStrings = messages.map(getElementStringFromMessage);
  return `<html>
  <head>
    <style>${CSS}</style>
  </head>
  <body>
  <header>
    <h1>${chatName}</h1>
  </header>
    <main class="message-container">${messageStrings.join("")}</main>
  </body>
  </html>`;
}

function getElementStringFromMessage(message: Message): string {
  const name = `<strong>${message.sender}</strong>`;
  if (message.isImage) {
    return `<p>${name} sent an image</p>`;
  }
  return `<p>${name}${formatReplyInfo(message.replyInfo)}: ${message.body}</p>`;
}

function formatReplyInfo(replyInfo: Message["replyInfo"]): string {
  if (!replyInfo) return "";
  return ` (replying to ${replyInfo.to}, who wrote: "${replyInfo.body}")`;
}

const CSS = `
body {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0;
    padding: 0;
}
body * {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}
.message-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 700px;
}
.message-container * {
  font-size: 16px;
}
.message-container p {
  text-align: justify;
  hyphens: auto;
  overflow-wrap: anywhere;
}`;

export function getRawStringFromMessageJSON(
  chatName: string,
  messages: Message[]
): string {
  const lines: string[] = [];
  lines.push("Chat: " + chatName);
  lines.push("------------");
  for (const message of messages) {
    const line = `${message.sender}${formatReplyInfo(message.replyInfo)}: ${
      message.body
    }`;
    lines.push(line);
  }
  return lines.join("\r\n");
}

# Facebook Messenger Chat Scraper

Are you frustrated that Meta's End-to-End Encryption service rendered some of your chats unsearchable?
Are you sad that some large chat histories are virtually inaccessible now?
Well, me too.
This is a tool to scrape that history back.

This may also be useful for folks who just want to extract a full chat history regardless.

This repo contains the source code for a [bookmarklet](https://en.wikipedia.org/wiki/Bookmarklet)
that carries out the scraping using some auto-scrolling, text-extracting DOM trickery.
It relies on some details of Messenger's DOM layout, so by nature it is slightly hacky.
Nonetheless I have tried to make it as usable as possible.

## Development

Have Node installed.
Clone this repo, run `npm i`, and run `npm run build`.
This will bundle a Javascript file,
then copy and format its contents as a bookmarklet,
and finally write the result into your clipboard.
Next, go to your browser and add a bookmark,
pasting the bookmarklet as the URL.

## Usage

Open a chat window in Facebook Messenger and click the bookmark.
This will run the bookmarklet script, which will create
a UI panel for you to scrape the currently active chat.
When it finishes scraping a chat, you will be able to export the chat history as either
a JSON of message objects or a readable, searchable plaintext file.
Scraping a chat in its entirety may take a while,
since it is bottlenecked by the speed at which Facebook feeds batches of messages to the webpage.
You may choose to stop the scraper before it has finished,
in which case the results will be partial,
and you can restart the scraping (or scrape a different chat) as desired.

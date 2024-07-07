# Facebook Messenger Chat Scraper

<img src="https://i.imgur.com/XULihkJ.png" height="300">

Are you frustrated that Meta's End-to-End Encryption service rendered some of your chats unsearchable?
Are you sad that some large chat histories are virtually inaccessible now?
Well, me too.
This is a tool to scrape that history back.

This may also be useful for folks who just want to extract their chat histories.

This repo contains the source code for a Chrome extension
that carries out the scraping using some auto-scrolling, text-extracting DOM trickery.
It relies on some details of Messenger's DOM layout, so by nature it is slightly hacky.
Nonetheless I have tried to make it as usable as possible.

If you don't use Chrome or you otherwise don't want to install a Chrome extension,
this repo also builds a [bookmarklet](https://en.wikipedia.org/wiki/Bookmarklet) as an alternative.

## Development and testing

Have Node installed.
Clone this repo, run `npm i`, and run `npm run build`.
This will bundle an updated `main.js` and place it in `chrome-extension/`,
which you can unpack and test using Chrome's extension development tools.

For the bookmarklet, run `npm run build:bookmarklet`.
This will bundle some javascript and copy it into your clipboard.
Go to your browser and paste it into the URL field of a new bookmark.

## Usage

Make sure the Chrome extension is enabled.
Then open a chat window in Facebook Messenger and click on extension icon.
This will open a UI panel that lets you scrape the currently active chat.
When it finishes scraping a chat, you will be able to export the chat history as either
a JSON of message objects or a readable, searchable plaintext file.

You will not be able to comfortably scroll in the chat while it is being scraped.
Scraping a chat in its entirety may take a while,
since it is bottlenecked by the speed at which Facebook feeds batches of messages to the webpage.
Clicking and opening a different chat during scraping will interrupt the scraper.
The UI lets you stop the scraper before it has finished,
in which case it will let you export a partial chat history.
You can restart the scraping (or scrape a different chat) as desired.

Chrome may pause execution of browser scripts running in inactive tabs,
so you will need to keep the Messenger tab open and active somewhere while scraping.
You can move the Messenger tab to its own window and browse in a different window,
or go read a book, or talk to friends.

Everything above applies analogously to the bookmarklet.

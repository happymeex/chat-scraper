# Facebook Messenger Chat Scraper

Are you frustrated that a chat of yours lost its search feature to Meta's End-to-End Encryption service?
Are you sad that some large chat histories are virtually inaccessible now?
Well, me too.
This is a tool to scrape that history back.

This may also be useful for folks who just want to extract a full chat history regardless.

This repo contains the source code for a [bookmarklet](https://en.wikipedia.org/wiki/Bookmarklet)
that carries out the scraping using some auto-scrolling, text-extracting DOM trickery.
It works, but because it relies on some empirical quirks of Messenger's DOM layout,
it may not work forever or for everyone.

## Usage

Clone and run `npm i`.
Then run `npm run build`.
This will compile and bundle a Javascript file,
copy and format its contents as a bookmarklet,
and then write the result into your clipboard.
Next, go to your browser and add a bookmark,
pasting the bookmarklet as the URL.
Finally, you can open a chat window Facebook Messenger and click the bookmark.
This will run the bookmarklet script in the background for a while;
don't touch it until it finishes, at which point
it will open a blank browser window and dump a JSON of chat message data into it.

This is still a prototype, there are TODOs left to handle.

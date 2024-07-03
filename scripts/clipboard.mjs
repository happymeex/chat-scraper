import fs from "fs";
import clipboardy from "clipboardy";

const rawJS = fs.readFileSync("./dist/scraper.js", "utf8");
const bookmarklet = `javascript:(function(){${rawJS}})()`;

clipboardy.writeSync(bookmarklet);

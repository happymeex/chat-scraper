import fs from "fs";
import clipboardy from "clipboardy";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pathToDist = path.join(__dirname, "..", "dist");
const rawJS = fs.readFileSync(path.join(pathToDist, "main.js"), "utf8");
const bookmarklet = `javascript:(function(){${rawJS}})()`;

fs.writeFileSync(path.join(pathToDist, "bookmarklet.txt"), bookmarklet);

try {
    clipboardy.writeSync(bookmarklet);
} catch (error) {
    console.error("Error writing bookmarklet to clipboard:", error.message);
    console.log("Please copy the bookmarklet from dist/bookmarklet.txt manually.");
}

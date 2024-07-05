import fs from "fs";
import clipboardy from "clipboardy";
import path from "path";

const pathToDist = path.join(import.meta.dirname, "..", "dist");
const rawJS = fs.readFileSync(path.join(pathToDist, "main.js"), "utf8");
const bookmarklet = `javascript:(function(){${rawJS}})()`;

fs.writeFileSync(path.join(pathToDist, "bookmarklet.txt"), bookmarklet);

clipboardy.writeSync(bookmarklet);

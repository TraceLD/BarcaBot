/* eslint-disable @typescript-eslint/no-var-requires */
const data = require("./data.json");
const fs = require("fs");

const indentation = "  ";
let s = "export const countries: Map<string, string> = new Map<string, string>([\n";

data.forEach((el) => {
  s += `${indentation}[\"${el.name}\", \"${el.alpha.toLowerCase()}\"],\n`;
});

s += "\n]);";

fs.writeFile("./out.ts", s, (err) => {
  if (err) {
    console.log(err);
  }
});

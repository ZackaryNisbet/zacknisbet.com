import { readFileSync } from "node:fs";

const html = readFileSync("index.html", "utf8");
const required = [
  "<script type=\"application/ld+json\">",
  "\"@type\": \"Person\"",
  "\"name\": \"Zack Nisbet\"",
  "\"alternateName\"",
  "https://zacknisbet.com/",
  "https://www.linkedin.com/in/zacknisbet/",
  "https://github.com/ZackaryNisbet"
];

const missing = required.filter((needle) => !html.includes(needle));

if (missing.length) {
  console.error(`Missing required site markers:\n${missing.join("\n")}`);
  process.exit(1);
}

const jsonText = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];

if (!jsonText) {
  console.error("JSON-LD script not found.");
  process.exit(1);
}

JSON.parse(jsonText);
console.log("Site checks passed.");


import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import { swaggerDocument } from "../src/config/swagger.js";

const outputPath = resolve("docs/openapi.json");
const expected = `${JSON.stringify(swaggerDocument, null, 2)}\n`;
const current = await readFile(outputPath, "utf8");

if (current !== expected) {
  console.error("docs/openapi.json esta desatualizado. Execute npm run swagger:export.");
  process.exit(1);
}

console.log("docs/openapi.json esta sincronizado com src/config/swagger.js.");

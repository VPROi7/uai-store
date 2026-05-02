import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

import { swaggerDocument } from "../src/config/swagger.js";

const outputPath = resolve("docs/openapi.json");

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(swaggerDocument, null, 2)}\n`);

console.log(`OpenAPI exportado em ${outputPath}`);

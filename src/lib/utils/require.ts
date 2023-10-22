import * as path from "path";
import * as fs from "fs-extra";

export const injectRequire = fs.readFileSync(
  path.join(__dirname, "./lib/require-js.js"),
  { encoding: "utf-8" }
);

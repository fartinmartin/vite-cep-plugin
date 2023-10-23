import * as path from "path";
import * as fs from "fs-extra";

export const injectRequire = fs.readFileSync(
  path.resolve(__dirname, "../../external/require-js.js"),
  { encoding: "utf-8" }
);

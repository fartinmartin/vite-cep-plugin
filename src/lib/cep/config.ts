import * as path from "path";
import * as fs from "fs-extra";
import { conColors, posix } from "../utils/lib";
import { devHtmlTemplate } from "../../templates/dev-html-template";
import type { ResolvedConfig } from "vite";
import { injectRequire } from "../utils/require";
const prettifyXml = require("prettify-xml");

export function createConfigResolved() {
  return function configResolved(config: ResolvedConfig | any) {
    if (!config.isProduction) {
      console.clear();
      console.log(`${conColors.green}CEP Panels Served at:`);
      console.log("");
      //@ts-ignore
      Object.keys(config.build.rollupOptions.input).map((key: string) => {
        //@ts-ignore
        const filePath = config.build.rollupOptions.input[key];
        const relativePath = path.relative(config.root, filePath);
        const destPath = path.resolve(config.build.outDir, relativePath);
        const panelHtmlFile = {
          type: "asset",
          source: devHtmlTemplate({
            ...config.cepConfig,
            url: `http://localhost:${config.cepConfig.port}/${posix(
              relativePath
            )}`,
            injectRequire,
          }),
          name: "CEP HTML Dev File",
          fileName: "index.html",
        };
        fs.writeFileSync(destPath, panelHtmlFile.source);
        console.log(
          `${conColors.white}   > ${path.dirname(relativePath)}: ${
            conColors.cyan
          }http://localhost:${config.cepConfig.port}/${posix(
            path.dirname(relativePath)
          )}/`
        );
      });
    }
  };
}

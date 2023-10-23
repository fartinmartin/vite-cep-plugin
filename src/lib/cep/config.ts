import * as path from "path";
import * as fs from "fs-extra";
import { conColors, posix } from "../utils/lib";
import { devHtmlTemplate } from "../../templates/dev-html-template";
import type { ResolvedConfig } from "vite";
import { injectRequire } from "../utils/require";
import { CepOptions } from "../../types";

export function createConfigResolved({ cepConfig }: CepOptions) {
  return function configResolved(config: ResolvedConfig) {
    if (config.isProduction) return;

    console.clear();
    console.log(`${conColors.green}CEP Panels Served at:`);
    console.log("");

    //@ts-ignore
    Object.keys(config.build.rollupOptions.input).map((key: string) => {
      //@ts-ignore
      const filePath = config.build.rollupOptions.input[key];
      const relativePath = path.relative(config.root, filePath);
      const destPath = path.resolve(config.build.outDir, relativePath);

      const port = cepConfig.port;
      const url = `http://localhost:${port}/${posix(relativePath)}`;

      const panelHtmlFile = {
        type: "asset",
        source: devHtmlTemplate({ ...cepConfig, url, injectRequire }),
        name: "CEP HTML Dev File",
        fileName: "index.html",
      };

      fs.writeFileSync(destPath, panelHtmlFile.source);

      const message = `${conColors.white}   > ${path.dirname(relativePath)}: ${
        conColors.cyan
      }${url}/`;
      console.log(message);
    });
  };
}

import { conColors, resetLog } from "../utils/lib";
import { CepOptions } from "../..";
import { createGenerateBundle, createWriteBundle } from "./bundle";
import { createConfigResolved } from "./config";
import { createTransformIndexHtml } from "./html";

export function cep(opts: CepOptions) {
  const { cepConfig, isServe } = opts;

  if (cepConfig && cepConfig.panels && isServe) {
    console.clear();
    console.log(`${conColors.green}CEP Panels Served at:\n`);

    cepConfig.panels.map((panel) => {
      const name = panel.name;
      const message = `${conColors.white}   > ${name}: ${conColors.cyan}http://localhost:${cepConfig.servePort}/${name}/`;
      console.log(message);
    });

    resetLog();
    console.log("");
  }

  let foundPackages: string[] = [];

  return {
    name: "cep",
    transformIndexHtml: createTransformIndexHtml(opts, foundPackages),
    configResolved: createConfigResolved(),
    writeBundle: createWriteBundle(opts, foundPackages),
    generateBundle: createGenerateBundle(opts),
  };
}

import * as path from "path";

import { CepOptions } from "../..";
import { CEP_Config, CEP_Config_Extended } from "../../types/cep-config";

import { manifestTemplate } from "../../templates/manifest-template";
import { debugTemplate } from "../../templates/debug-template";

import { log, conColors } from "../utils";
import { unique } from "../utils";
import { copyModules } from "../copy-node/copy-modules";
import { copyFiles } from "../copy-node/copy-files";

import { signZXP } from "../zxp";
import { metaPackage } from "../zip/meta-package";

import { ccExtensionDir } from "../utils";

import { makeSymlink } from "../symlink/make-symlink";
import { tmpDir } from "../utils/tmp-dir";
const prettifyXml = require("prettify-xml");

export function createWriteBundle(
  {
    cepConfig,
    dir,
    isPackage,
    isMetaPackage,
    cepDist,
    zxpDir,
    zipDir,
    packages,
  }: CepOptions,
  foundPackages: string[]
) {
  return async function writeBundle() {
    // console.log(" BUILD END");

    const root = "./";
    const src = "./src";
    const dest = "dist/cep";
    const symlink = false;

    const allPackages = unique(packages.concat(foundPackages));

    copyModules({ packages: allPackages, src: root, dest, symlink });

    if (cepConfig.copyAssets) {
      copyFiles({
        src: path.join(process.cwd(), src),
        dest: path.join(process.cwd(), dest),
        assets: cepConfig.copyAssets,
      });
    }

    // console.log("FINISH");
    if (isPackage) {
      const zxpPath = await signZXP(
        cepConfig,
        path.join(dir, cepDist),
        zxpDir,
        tmpDir
      );
      if (isMetaPackage) {
        await metaPackage(
          cepConfig,
          zipDir,
          zxpPath,
          src,
          cepConfig.copyZipAssets
        );
      }
    }
  };
}

export function createGenerateBundle({
  cepConfig,
  isPackage,
  isProduction,
  dir,
  cepDist,
}: CepOptions) {
  return async function generateBundle(this: any, output: any, bundle: any) {
    const process =
      (isPackage && "zxp package") || (isProduction && "build") || "dev";
    console.log(`${conColors.green}cep process: ${process}`);

    const extendedConfig = fillPanelFields(cepConfig);

    handleManifestFile.call(this, extendedConfig);
    // handleMenuFile.call(this, cepConfig)
    handleDebugFile.call(this, extendedConfig);

    try {
      const symlinkPath =
        cepConfig.symlink === "global"
          ? ccExtensionDir.global
          : ccExtensionDir.local;
      const res = makeSymlink(
        path.join(dir, cepDist),
        path.join(symlinkPath, cepConfig.id)
      );
    } catch (e) {
      console.warn(e);
    } finally {
      console.log("");
    }
  };
}

// Fill any empty panel fields with extension's defaults
function fillPanelFields(config: CEP_Config) {
  let newConfig: CEP_Config_Extended = {
    ...config,
    panels: config.panels.map((panel) => {
      let newProps: any = { ...config, ...panel };
      return {
        id: panel.id ? panel.id : `${config.id}.${panel.name}`,
        name: newProps.name,
        parameters: newProps.parameters,
        autoVisible: newProps.autoVisible,
        mainPath: newProps.mainPath,
        type: newProps.type,
        host: newProps.host,
        panelDisplayName: newProps.panelDisplayName,
        width: newProps.width,
        height: newProps.height,
        minWidth: newProps.minWidth,
        minHeight: newProps.minHeight,
        maxWidth: newProps.maxWidth,
        maxHeight: newProps.maxHeight,
        iconNormal: newProps.iconNormal,
        iconDarkNormal: newProps.iconDarkNormal,
        iconNormalRollOver: newProps.iconNormalRollOver,
        iconDarkNormalRollOver: newProps.iconDarkNormalRollOver,
        scriptPath: newProps.scriptPath,
        startOnEvents: newProps.startOnEvents,
      };
    }),
  };
  return newConfig;
}

function handleDebugFile(this: any, extendedConfig: CEP_Config_Extended) {
  const template = debugTemplate(extendedConfig);
  const xml = prettifyXml(template);

  const debugFile = {
    type: "asset",
    source: xml,
    name: "CEP Debug File",
    fileName: path.join(".debug"),
  };
  //@ts-ignore
  this.emitFile(debugFile);
  log("debug file created", true);
}

function handleManifestFile(this: any, extendedConfig: CEP_Config_Extended) {
  const template = manifestTemplate(extendedConfig);
  const xml = prettifyXml(template, { indent: 2, newline: "\n" });

  const manifestFile = {
    type: "asset",
    source: xml,
    name: "CEP Manifest File",
    fileName: path.join("CSXS", "manifest.xml"),
  };

  //@ts-ignore
  this.emitFile(manifestFile);
  log("manifest created", true);
}

// function handleMenuFile(cepConfig: CepOptions["cepConfig"]) {
//   const menuFile = {
//     type: "asset",
//     source: menuHtmlTemplate({
//       displayName: cepConfig.displayName,
//       menu: cepConfig.panels.map((panel) => {
//         return {
//           name: panel.name,
//           url: panel.mainPath,
//         };
//       }),
//     }),
//     name: "Menu File",
//     fileName: path.join("index.html"),
//   };
//   // @ts-ignore
//   this.emitFile(menuFile);
//   log("menu created", true);
// }

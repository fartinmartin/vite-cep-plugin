import * as path from "path";
import {
  fixAssetPathCSS,
  fixAssetPathJS,
  fixAssetPathHTML,
  removeModuleTags,
} from "../utils/lib";
import type { HtmlTagDescriptor } from "vite";
import { nodeBuiltIns } from "../utils/node-built-ins";
import { CepOptions } from "../..";
import { injectRequire } from "../utils/require";

export function createTransformIndexHtml(
  { debugReact }: CepOptions,
  foundPackages: string[]
) {
  return function transformIndexHtml(code: string, opts: any) {
    const browserRequireIgnore: HtmlTagDescriptor = {
      tag: "script",
      children: injectRequire,
    };

    if (opts && opts.bundle) {
      Object.keys(opts.bundle).filter((file) => {
        if (path.extname(file) === ".css") {
          let newCode = opts.bundle[file].source;
          if (newCode) {
            opts.bundle[file].source = fixAssetPathCSS(newCode);
          } else {
            console.log("missing code: ", file);
          }
        }
      });
    }

    // console.log("HTML Transform");
    const isDev = opts.server !== undefined;
    if (isDev) {
      const tags: HtmlTagDescriptor[] = [browserRequireIgnore];
      return tags;
    }
    let cssFileNameMatches = code.match(/(href=\".*.css\")/g);
    const cssFileNames =
      cssFileNameMatches &&
      Array.from(cssFileNameMatches).map((file) =>
        file.replace('href="', "").replace('"', "")
      );
    const jsFileNameMatch = code.match(/(src=\".*.js\")/);
    const jsFileName =
      jsFileNameMatch &&
      //@ts-ignore
      jsFileNameMatch.pop().replace('src="', "").replace('"', "");

    // TODO: better require transformations
    //@ts-ignore
    const jsName = jsFileName.substr(1);

    let newCode = opts.bundle[jsName].code;

    const allRequires = newCode.match(
      /(require\(\"([A-z]|[0-9]|\.|\/|\-)*\"\)(\;|\,))/g
    );
    if (allRequires) {
      const requireNames = allRequires.map((req: string) =>
        //@ts-ignore
        req.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0].replace(/\"/g, "")
      );
      const copyModules = requireNames.filter(
        (name: string) =>
          !nodeBuiltIns.includes(name) && ![".", "/", "\\"].includes(name[0])
      );
      foundPackages = foundPackages.concat(copyModules);
    }

    const matches = newCode.match(
      /(\=require\(\"\.([A-z]|[0-9]|\.|\/|\-)*\"\)(\;|\,))/g
    );
    matches?.map((match: string) => {
      const jsPath = match.match(/\".*\"/);
      //@ts-ignore
      const jsBasename = path.basename(jsPath[0]);
      if (jsPath) {
        newCode = newCode.replace(
          match.substring(0, match.length - 1),
          `=typeof cep_node !== 'undefined'?cep_node.require(cep_node.global["__dir"+"name"] + "/assets/${jsBasename}):require("../assets/${jsBasename})`
        );
      }
    });
    newCode = newCode.replace(
      `"use strict"`,
      `"use strict"\rif (typeof exports === 'undefined') { var exports = {}; }`
    );
    opts.bundle[jsName].code = newCode;

    Object.keys(opts.bundle).map((key) => {
      if (path.extname(key) === ".js") {
        let { code, source } = opts.bundle[key];
        if (code && code.replace) {
          opts.bundle[key].code = fixAssetPathJS(code);
        } else if (source && source.replace) {
          opts.bundle[key].source = fixAssetPathJS(source);
        } else {
          console.log("missing code and source: ", opts.bundle[key]);
        }
      }
    });

    const tags: HtmlTagDescriptor[] = [
      browserRequireIgnore,
      {
        tag: "script",
        attrs: { src: `..${jsFileName}` },
        injectTo: "body",
      },
    ];

    code = removeModuleTags(code);
    code = fixAssetPathHTML(code);

    if (debugReact) {
      tags.push({
        tag: "script",
        attrs: { src: "http://localhost:8097" },
        injectTo: "body",
      });
    }

    return {
      tags,
      html: code,
    };
  };
}

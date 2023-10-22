import * as path from "path";
import { Plugin } from "rollup";
import * as fs from "fs-extra";
import MagicString from "magic-string";

export const jsxInclude = ({
  iife,
  globalThis,
}: {
  iife: boolean;
  globalThis: string;
}): Plugin | any => {
  const foundIncludes: string[] = [];
  return {
    name: "extendscript-include-resolver",
    generateBundle: (
      output: any,
      bundle: { [key: string]: { code: string } }
    ) => {
      const esFile = Object.keys(bundle).pop() as keyof object;
      const core = [
        "// ----- EXTENDSCRIPT INCLUDES ------ //",
        ...foundIncludes,
        "// ---------------------------------- //",
        bundle[esFile].code,
      ];
      if (iife) {
        const banner = `(function (${globalThis}) {`;
        const footer = "})(this);";
        bundle[esFile].code = [banner, ...core, footer].join("\r");
      } else {
        bundle[esFile].code = core.join("\r");
      }
    },
    transform: (code: string, id: string) => {
      const s = new MagicString(code);
      // console.log("looking for JSXINCLUDE");
      const includeMatches = code.match(/^\/\/(\s|)\@include(.*)/gm);
      if (includeMatches) {
        // console.log("FOUND!", matches);
        includeMatches.map((match: string) => {
          const innerMatches = match.match(/(?:'|").*(?:'|")/);
          const firstMatch = innerMatches?.pop();
          if (firstMatch) {
            const relativeDir = firstMatch.replace(/(\"|\')/g, "");
            const filePath = path.join(path.dirname(id), relativeDir);
            let text = "";
            if (fs.existsSync(filePath)) {
              text = fs.readFileSync(filePath, { encoding: "utf-8" });
              foundIncludes.push(text);
            } else {
              console.warn(
                `WARNING: File cannot be found for include ${match}`
              );
            }
            // console.log("INDEX :: ", code.indexOf(match));
            // console.log("CODE :: ", code);
            s.overwrite(
              code.indexOf(match),
              code.indexOf(match) + match.length,
              ""
            );
          }
        });
      }
      const commentMatches = code.match(/\/\/(\s|)\@(.*)/gm);
      if (commentMatches) {
        let end = 0;
        commentMatches.map((comment) => {
          const start = code.indexOf(comment, end);
          end = start + comment.length;
          s.overwrite(start, end, "");
        });
      }
      return {
        code: s.toString(),
        map: s.generateMap({
          source: id,
          file: `${id}.map`,
          includeContent: true,
        }),
      };
    },
  };
};

import { Plugin } from "rollup";
import MagicString from "magic-string";

interface PonyFillItem {
  find: string;
  replace: string;
  inject: string;
}

export const jsxPonyfill = (extraPonyfills?: PonyFillItem[]): Plugin | any => {
  let usedPonyfills = new Set<PonyFillItem>();
  let ponyfills: PonyFillItem[] = [
    {
      find: "Object.freeze",
      replace: "__objectFreeze",
      inject: `function __objectFreeze(obj) { return obj; }`,
    },
    {
      find: "Array.isArray",
      replace: "__isArray",
      inject: `function __isArray(arr) { try { return arr instanceof Array; } catch (e) { return false; } };`,
    },
  ];
  if (extraPonyfills) {
    ponyfills = [...ponyfills, ...extraPonyfills];
  }
  return {
    name: "extendscript-ponyfill-resolver",
    generateBundle: (
      output: any,
      bundle: { [key: string]: { code: string } }
    ) => {
      const esFile = Object.keys(bundle).pop() as keyof object;

      let ponyfillStr = [
        `// ----- EXTENDSCRIPT PONYFILLS -----`,
        Array.from(usedPonyfills)
          .map((p) => p.inject)
          .join("\r"),
        "// ---------------------------------- //",
      ].join("\r");

      const core = [ponyfillStr, bundle[esFile].code];
      bundle[esFile].code = core.join("\r");
    },
    renderChunk: (code: string, chunk: any) => {
      const id = chunk.fileName;
      const s = new MagicString(code);
      // console.log("Ponyfill Time");
      ponyfills.map((pony) => {
        const regexp = new RegExp(pony.find, "g");
        const gen = code.matchAll(regexp);
        // console.log("GEN", gen);
        if (gen) {
          const matches = [...gen];
          // console.log("FOUND!", pony.find);
          matches.map((match) => {
            usedPonyfills.add(pony);
            const index = match.index;
            const length = match[0].length;
            if (index) {
              // console.log("REPLACING :: ", index, index + length);
              s.overwrite(
                index,
                index + length,
                pony.replace
                // text
              );
            }
          });
        }
      });

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

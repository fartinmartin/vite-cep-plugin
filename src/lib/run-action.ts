import * as path from "path";
import { resetLog } from "./utils/lib";
import { packageSync } from "./package-sync";
import { ccExtensionDir } from "./utils/extension-dir";
import { removeSymlink } from "./symlink/remove-symlink";
import { makeSymlink } from "./symlink/make-symlink";
import { CepOptions } from "..";

export const runAction = (opts: CepOptions, action: string) => {
  const { cepConfig, dir, cepDist } = opts;

  const symlinkPath =
    cepConfig.symlink === "global"
      ? ccExtensionDir.global
      : ccExtensionDir.local;

  const symlinkSrc = path.join(dir, cepDist);
  const symlinkDst = path.join(symlinkPath, cepConfig.id);

  if (action === "symlink") {
    makeSymlink(symlinkSrc, symlinkDst);
  } else if (action === "delsymlink") {
    removeSymlink(symlinkSrc, symlinkDst);
  } else if (action === "dependencyCheck") {
    console.log("Checking Dependencies");
    packageSync();
  } else {
    console.warn(`Unknown Action: ${action}`);
  }

  resetLog();
};

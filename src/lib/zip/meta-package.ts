import * as fs from "fs";
import * as path from "path";
import { log, resetLog } from "../utils/lib";
import { CEP_Config } from "../../types/cep-config";
import { copyFiles } from "../copy-node/copy-files";
import { createZip } from "./create-zip";

export const metaPackage = async (
  config: CEP_Config,
  dest: string,
  zxp: string,
  src: string,
  assets?: string[]
) => {
  const tmpDir = path.join(dest, "tmp");
  console.log({
    dest,
    zxp,
    src,
    assets,
  });
  fs.mkdirSync(tmpDir, { recursive: true });
  fs.copyFileSync(zxp, path.join(tmpDir, path.basename(zxp)));

  if (assets) {
    copyFiles({
      src,
      dest: tmpDir,
      assets,
    });
  }

  const zip = await createZip(
    tmpDir,
    dest,
    `${config.displayName}_${config.version}`
  );
  log("built zip", true, zip);
  fs.rmSync(tmpDir, { recursive: true });
  resetLog();
  return zip;
};

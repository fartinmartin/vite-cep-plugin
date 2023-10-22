import * as path from "path";
import * as fs from "fs-extra";
import { unique } from "../utils";
import { nodeSolve } from "./node-solve";

export interface CopyModulesArgs {
  packages: string[];
  src: string;
  dest: string;
  symlink: boolean;
}

export const copyModules = ({
  packages,
  src,
  dest,
  symlink,
}: CopyModulesArgs) => {
  const allPkg = packages.flatMap((pkg) =>
    nodeSolve({ src, pkg, keepDevDependencies: false })
  );
  const uniqePkg = unique(allPkg);
  console.log(
    `Copying ${packages.length} Node Module(s) (${
      uniqePkg.length
    } Dependencies) : ${packages.join(",")}`
  );
  fs.ensureDirSync(path.join(dest, "node_modules"));
  uniqePkg.map((pkg: string) => {
    const fullSrcPath = path.join(process.cwd(), src, "node_modules", pkg);
    const fullDstPath = path.join(process.cwd(), dest, "node_modules", pkg);
    fs.ensureDirSync(path.dirname(fullDstPath));
    if (!symlink) {
      fs.copySync(fullSrcPath, fullDstPath, { dereference: true });
    } else {
      fs.ensureSymlink(fullSrcPath, fullDstPath, "dir");
    }
  });
};

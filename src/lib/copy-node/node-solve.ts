import * as path from "path";
import * as fs from "fs-extra";

interface NodeSolveArgs {
  src: string;
  pkg: string;
  keepDevDependencies: boolean;
}

export const nodeSolve = ({ src, pkg, keepDevDependencies }: NodeSolveArgs) => {
  let allDependencies = [pkg];
  const fullPath = path.join(src, "node_modules", pkg);
  // console.log(`getting pkgs for ${fullPath}`);
  const pkgJson = path.join(fullPath, "package.json");
  if (fs.existsSync(pkgJson)) {
    const raw = fs.readFileSync(pkgJson, { encoding: "utf-8" });
    const json = JSON.parse(raw);
    let { dependencies, devDependencies } = json;
    const depList = dependencies ? Object.keys(dependencies) : [];
    const devDepList = devDependencies ? Object.keys(devDependencies) : [];
    const resDepList = keepDevDependencies
      ? depList.concat(devDepList)
      : depList;
    if (resDepList.length > 0) {
      allDependencies = allDependencies.concat(resDepList);
      resDepList.map((name) => {
        allDependencies = allDependencies.concat(
          nodeSolve({ src, pkg: name, keepDevDependencies })
        );
      });
    }
  }
  return allDependencies || [];
};

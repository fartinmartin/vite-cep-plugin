import * as path from "path";
import * as fs from "fs-extra";

export interface CopyFilesArgs {
  src: string;
  dest: string;
  assets: string[];
}

export const copyFiles = ({ src, dest, assets }: CopyFilesArgs) => {
  console.log(`Copying ${assets.length} Assets`);
  // fs.ensureDirSync(path.join(dest, "node_modules"));
  assets.map((asset: string) => {
    const fullSrcPath = path.join(src, asset);
    if (asset.indexOf("/*") === asset.length - 2) {
      // flatten folder
      const folder = asset.substring(0, asset.length - 2);
      const files = fs.readdirSync(path.join(src, folder));

      files.map((file) => {
        const fullSrcPath = path.join(src, folder, file);
        const fullDstPath = path.join(dest, file);
        console.log(`COPY ${fullSrcPath} to ${fullDstPath}`);
        fs.ensureDirSync(path.dirname(fullDstPath));
        fs.copySync(fullSrcPath, fullDstPath);
      });
    } else {
      const fullDstPath = path.join(dest, asset);
      console.log(`COPY ${fullSrcPath} to ${fullDstPath}`);
      fs.ensureDirSync(path.dirname(fullDstPath));
      fs.copySync(fullSrcPath, fullDstPath);
    }
  });
};

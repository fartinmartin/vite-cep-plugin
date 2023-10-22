import * as fs from "fs";
import * as path from "path";
import * as archiver from "archiver";

export const createZip = (
  src: string,
  dst: string,
  name: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const archive = archiver("zip");
    const zipDest = path.join(dst, `${name}.zip`);
    const output = fs.createWriteStream(zipDest);
    output.on("close", () => {
      // console.log(`zip archive created. ( ${archive.pointer()} bytes )`);
      resolve(zipDest);
    });
    archive.on("error", (err) => {
      reject(err.message);
    });

    archive.pipe(output);

    // append files from a sub-directory, putting its contents at the root of archive
    archive.directory(src, false);

    // append files from a sub-directory and naming it `new-subdir` within the archive
    //   archive.directory(dst, "new-subdir");
    archive.finalize();
  });
};

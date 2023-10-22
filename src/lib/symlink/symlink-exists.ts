import * as fs from "fs-extra";

export const symlinkExists = (dir: string) => {
  let exists, readlink, lstat;
  // try {
  //   exists = fs.existsSync(dir);
  // } catch (e) {}
  // try {
  //   readlink = fs.readlinkSync(dir);
  // } catch (e) {}
  try {
    lstat = fs.lstatSync(dir);
    exists = true;
  } catch (e) {
    exists = false;
  }
  return exists;
};

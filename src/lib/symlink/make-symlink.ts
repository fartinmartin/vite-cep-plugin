import * as path from "path";
import * as fs from "fs-extra";
import { log } from "../utils/lib";
import { symlinkExists } from "./symlink-exists";

export const makeSymlink = (dist: string, dest: string) => {
  try {
    if (symlinkExists(dest)) {
      if (path.resolve(fs.readlinkSync(dest)) === path.resolve(dist)) {
        log("symlink already exists", true);
        return "exists";
      } else {
        // incorrect link, remove and re-create
        fs.unlinkSync(dest);
      }
    }
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.symlinkSync(dist, dest, "junction");
    log("symlink created", true);
    return "created";
  } catch (e) {
    console.log(e);
    log("symlink failed. Try running 'sudo yarn symlink'", false);
    return "error";
  }
};

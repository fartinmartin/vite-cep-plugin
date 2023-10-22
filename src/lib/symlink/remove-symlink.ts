import * as fs from "fs-extra";
import { log } from "../utils/lib";
import { symlinkExists } from "./symlink-exists";

export const removeSymlink = (dist: string, dest: string) => {
  try {
    if (symlinkExists(dest)) {
      fs.unlinkSync(dest);
      log("symlink removed successfully", true);
      return "removed";
    } else {
      log("no symlink exists", true);
      return "none";
    }
  } catch (e) {
    log(
      "symlink removal failed. Try removing with 'sudo yarn delsymlink'",
      false
    );
    return "error";
  }
};

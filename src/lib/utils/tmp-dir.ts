import * as path from "path";
import * as fs from "fs-extra";

export const tmpDir = path.join(__dirname, ".tmp");
fs.ensureDirSync(tmpDir);

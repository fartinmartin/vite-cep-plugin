import * as os from "os";
import * as path from "path";

const platform = os.platform();
const homedir = os.homedir();

const ccGlobalExtensionFolder =
  platform == "win32"
    ? "C:/Program Files (x86)/Common Files/Adobe/CEP/extensions"
    : "/Library/Application Support/Adobe/CEP/extensions/";

const ccLocalExtensionFolder =
  platform == "win32"
    ? path.join(homedir, "/AppData/Roaming/Adobe/CEP/extensions")
    : path.join(homedir, `/Library/Application Support/Adobe/CEP/extensions`);

export const ccExtensionDir = {
  global: ccGlobalExtensionFolder,
  local: ccLocalExtensionFolder,
};

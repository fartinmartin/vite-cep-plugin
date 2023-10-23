// For more details on Manifest Preferences see:
// https://github.com/Adobe-CEP/CEP-Resources/blob/master/CEP_11.x/Documentation/CEP%2011.1%20HTML%20Extension%20Cookbook.md

export type CEP_Host_Name =
  | "PHSP"
  | "PHXS"
  | "IDSN"
  | "AICY"
  | "ILST"
  | "PPRO"
  | "PRLD"
  | "AEFT"
  | "FLPR"
  | "AUDT"
  | "DRWV"
  | "KBRG"
  | "AME"
  | "MUSE"
  | "LTRM"
  | "DEMO"
  | "BRDG"
  | "RUSH";

export type CEP_Host = {
  name: CEP_Host_Name;
  version: string;
};

export type CEF_Command =
  | "--enable-media-stream"
  | "--enable-speech-input"
  | "--enable-file-cookies"
  | "--enable-nodejs"
  | "--persist-session-cookies"
  | "--disable-image-loading"
  | "--disable-javascript-open-windows"
  | "--disable-javascript-close-windows"
  | "--disable-javascript-access-clipboard"
  | "--enable-caret-browsing"
  | "--proxy-auto-detect"
  | "--user-agent"
  | "--disable-application-cache"
  | "--disable-pinch"
  | "--mixed-context"
  | "--allow-file-access"
  | "--disable-popup-blocking"
  | "--aggressive-cache-discard"
  | "--winhttp-proxy-resolver"
  | "--v=0"
  | "--v=1"
  | "--v=2"
  | "--v=3"
  | "--v=4"
  | "--v=5";

export type CEP_Panel_Type =
  | "Panel"
  | "ModalDialog"
  | "Modeless"
  | "Custom"
  | "Embedded";

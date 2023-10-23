import { CEF_Command, CEP_Host, CEP_Panel_Type } from "./cep";

export interface CEP_Config {
  id: string;
  version: string;
  displayName: string;
  type: CEP_Panel_Type;
  symlink: "local" | "global";

  extensionManifestVersion: number;
  requiredRuntimeVersion: number;

  hosts: CEP_Host[];
  panels: CEP_Panel[];
  parameters: CEF_Command[];

  scriptPath?: string;
  installModules?: string[];

  // https://stackoverflow.com/a/17329699/8703073
  standalone?: boolean;

  serverConfig: {
    port: number;
    servePort: number;
    startingDebugPort: number;
  };

  icons: IconConfig;
  window: WindowConfig;

  build?: {
    sourceMap?: boolean;
    jsxBin?: JSXBIN_MODE;
  };

  zxp: {
    country: string;
    province: string;
    org: string;
    password: string;
    tsa: string;
    sourceMap?: boolean;
    jsxBin?: JSXBIN_MODE;
  };

  bundle?: {
    copy?: string[];
    zip?: string[];
  };
}

export interface CEP_Config_Extended extends CEP_Config {
  panels: CEP_Extended_Panel[];
}

export type JSXBIN_MODE = "off" | "copy" | "replace";

export interface CEP_Panel {
  name: string;
  displayName?: string | null;

  mainPath: string;
  scriptPath?: string;

  id?: string;
  parameters?: CEF_Command[];
  type?: CEP_Panel_Type;

  host?: string;
  startOnEvents?: string[];

  window: WindowConfig & { autoVisible: boolean };
  icons?: IconConfig;
}

export interface CEP_Extended_Panel extends CEP_Panel {
  id: string;
  parameters: CEF_Command[];
  type: CEP_Panel_Type;
  icons: IconConfig;
}

interface IconConfig {
  darkNormal?: string;
  normal?: string;
  darkNormalRollOver?: string;
  normalRollOver?: string;
}

interface WindowConfig {
  width?: number;
  height?: number;
  maxWidth?: number;
  maxHeight?: number;
  minWidth?: number;
  minHeight?: number;
}

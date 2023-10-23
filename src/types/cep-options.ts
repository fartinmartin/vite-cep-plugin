import { CEP_Config } from "./cep-config";

export interface CepOptions {
  cepConfig: CEP_Config;
  dir: string;
  cepDist: string;

  zxpDir: string;
  zipDir: string;
  packages: string[];

  isProduction: boolean;
  isPackage: boolean;
  isMetaPackage: boolean;
  isServe: boolean;

  debugReact: boolean;
}

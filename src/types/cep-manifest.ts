// https://github.com/Adobe-CEP/CEP-Resources/blob/master/CEP_8.x/ExtensionManifest_v_7_0.xsd
import { CEP_Host_Name, CEF_Command, CEP_Panel_Type } from "./cep";

export interface CEP_Manifest {
  /** The Id for all extensions included in this ExtensionManifest. */
  extensionBundleId: string;
  /** The version of this ExtensionBundle. */
  extensionBundleVersion: Version;
  /** An optional user-friendly name for this ExtensionBundle. */
  extensionBundleName?: string;
  /** Contains a list of extensions defined in this ExtensionManifest. */
  extensionList: Extension[];
  /** */
  executionEnvironment: {
    /** Contains a list of all supported hosts. */
    hostList: Host[];
    /** Contains a list for all supported locales. */
    localeList: Locale[];
    /** Contains a list for all required runtimes. The absence for any runtime implies no requirement. */
    requiredRuntimeList: RequiredRuntime[];
  };
  /** Contains a list for every extension's attributes. */
  dispatchInfoList: ExtensionConfig[];
  /** An optional author of this ExtensionBundle. */
  author?: string;
  /** An optional contact email for this ExtensionBundle. */
  contact?: string;
  /** An optional legal notice URL  for this ExtensionBundle. */
  legal?: string;
  /** An optional abstract URL for this ExtensionBundle. */
  abstract?: string;
}

/** Declaration of an extension specified in this ExtensionManifest. There can be an arbitrary number of extension specified.*/
export interface Extension {
  /** The id of the specific extension. This id has to be unique within the whole CEP system. Recommendation is to use reverse domain names. This id is used within the ExtensionManifest as reference in other tags. */
  id: string;
  /** The version of the specific extension. */
  verstion?: Version;
}

/** The host defines a supported product. */
export interface Host {
  name: CEP_Host_Name;
  version: RangedVersion;
}

export interface Locale {
  code: LanguageCode;
}

/** Specifies runtimes which must be available in order for the extension to run. For CS5 and CS5.5, the CEP runtime version is 2.0; for CS6, it is 3.0; for CC 2013, it is 4.0; for CC 2014, it is 5.0. Specifying an accurate CEP runtime requirement is recommended, since this value enables (though does not guarantee) compatibility with future versions of CEP. If no CEP runtime requirement is specified, the target CEP runtime is assumed to be 2.0 and above. This is significant, because extensions which target older CEP runtime versions may not be loaded by future versions of CEP. */
export interface RequiredRuntime {
  name: string; // CEPVersion;
  version: RangedVersion;
}

/** Declaration of the extension for which the following list of DispatchInfos is declared. */
export interface ExtensionConfig {
  /** The id of the extension. This must refer to an extension defined in /ExtensionManifest/ExtensionList/Extension. */
  id: string;
  /** The "HostList" tag allows the user to define a host list specific to each extension by overriding both the optional "Host" attribute in the "DispatchInfo" tag and the "HostList" tag under the "ExecutionEnvrironment" tag. If no "HostList" tag is defined, either the optional "Host" attribute or the the default host list will be used.*/
  hostList: Host[]; // TODO: Omit<Host, version> ?
  /** A DispatchInfo contains all parameter which are needed to run an extension. A DispatchInfo can have an optional attribute "Host" to define specific attributes per "Host". If an DispatchInfo has no "Host" it will act as a default for all values which are not set in a specific Host-DispatchInfo. */
  dispatchInfo: DispatchInfo[];
  /** Specifies a list of extensions which this extension depends upon. Adobe Extension Manager will install this extension only if all of its strict dependencies are already installed in the system. */
  dependencyList?: Dependency[];
}

/** A DispatchInfo contains all parameters needed to run an extension. A DispatchInfo can have an optional attribute "Host" to define specific attributes per "Host". If a DispatchInfo has no "Host," it will act as a default for all values not set in a specific Host-DispatchInfo. */
export interface DispatchInfo {
  /** The Resources tag contains all resources (source files) to run the extension. */
  resources?: Resource;
  /** In the Lifecycle the extension can specify its desired behavior regarding startup and shutdown. */
  lifecycle?: Lifecycle;
  /** Defines UI related properties of the extension. */
  ui?: UI;
  /** This section contains arbitrary information about this extension. This value is localizable. */
  extensionData?: { [key: string]: string }[];
  /** A DispatchInfo can have an optional attribute "Host" to define specific attributes per "Host". If a DispatchInfo has no "Host," it will act as a default for all values not set in a specific Host-DispatchInfo. */
  host?: CEP_Host_Name;
}

export interface UI {
  /** Specifies the type of the extension. Note that the "Custom" type means that it is up to the point product to decide how this extension will be handled. This value is localizable. */
  type?: CEP_Panel_Type;
  /** Specifies the name for the menu entry. This value is localizable. */
  menu?: string;
  /** A special placement which doesn't have to be honored by the point products. This value is localizable. */
  menuPlacement?: string;
  /** Specifies the geometry of the extension. Please note that all elements are onle "preferred" values. Some point products will not support all of these values. These values can be overwritten by an AIR extension through the AIR window API. */
  geometry?: {
    /** If values are provided here both have to be specified. Note that those values can be scattered over different DispatchInfos. */
    screenPercentage?: GeometryPercentage;
    /** If values are provided here both have to be specified. Note that those values can be scattered over different DispatchInfos. */
    size?: Geometry;
    /** If values are provided here both have to be specified. Note that those values can be scattered over different DispatchInfos. */
    maxSize?: Geometry;
    /** If values are provided here both have to be specified. Note that those values can be scattered over different DispatchInfos. */
    minSize?: Geometry;
  };
  /** Icons provided for the UI of this extension. */
  icons?: Icon[];
}

export interface Resource {
  mainPath?: string;
  /** The ScriptPath contains the path to the extension's script file. The path has to be relative to the extension's root directory and start with a "./". Use "/" as a path delimiter. This value is localizable. */
  scriptPath?: {
    engine?: string;
  };
  /** Contains a list of CEF command line parameters. */
  CEFCommandLine?: CEF_Command[];
}

export interface Lifecycle {
  /** This flag controls whether the extension's UI should be made visible automatically when started or if the extension wants to control this itself. Panel type extensions should always be made visible automatically in order to maintain consistency with non-CEP panels. This value is localizable. */
  autoVisible?: boolean;
  /** With StartOn, the extension can define different ways to start itself. */
  startOn?: Event[];
}

export interface GeometryPercentage {
  /** The percentage for height based on the screen size. */
  height?: string;
  /** The percentage for width based on the screen size. */
  width?: string;
}

export interface Geometry {
  /** The height. If not provided this will default to the system default or any value set in the AIR API. This value is localizable. */
  height?: string;
  /** The width. If not provided this will default to the system default or any value set in the AIR API. This value is localizable. */
  width?: string;
}

/** A specific icon for a given type. This value is localizable. */
export interface Icon {
  /** A RelativePath element which can also be localized. */
  path: string;
  type: "Normal" | "Disabled" | "RollOver" | "DarkNormal" | "DarkRollOver";
}

/** Specifies an extension which this extension depends on. */
export interface Dependency {
  /** The id of the extension which is depended upon. */
  id: string;
  /** Specifies that a particular version of the extension is depended upon. Either a single version or a range of versions may be specified. A range of versions must be specified using inclusive lower and upper bounds; exclusive bounds are not allowed. Omitting this attribute indicates that no specific version is required. */
  version?: InclusiveRangedVersion;
}

/** A version consists of major.minor.micro.special. major, minor, micro must be numbers and special can be any string (version parts can have up to 9 digits). At least the major has to be specified, all other elements are optional. If minor or micro versions are not specified, they are assumed to be zero. When it comes to comparing versions the special discriminator will be compared based on UTF-8 encoding.  */
export type Version = `${number}.${number}.${number}.${string}`;
/** A ranged version defines at least a minimum version and optionally a maximum version. If only one version is specified it is taken as minimum version with no special maximum version. With "[","]", "(" and ")" inclusive and exclusive ranges can be specified. For example, to define a range from 7.0 to 7.5 inclusive, use [7.0,7.5]. Note that because unspecified versions are assumed to be zero, 7.5.1 is not included in this range. To include 7.5.1 and any other micro version changes, use the range [7.0,7.6) which includes versions greater than 7.0.0 but less than 7.6.0. See definition of Version for further information. */
export type RangedVersion =
  | `[${Version},${Version})`
  | `[${Version},${Version}]`
  | `(${Version},${Version})`
  | `(${Version},${Version}]`;
/** An InclusiveRangedVersion is the same as a RangedVersion, except that only a single version or an inclusive version range may be specified (using "[","]" notation). An exclusive version range cannot be specified. */
export type InclusiveRangedVersion = `[${Version},${Version}]` | Version;
/** The language code in the form xx_XX or All. */
export type LanguageCode = `${string}_${string}` | "All";
export type CEPVersion = "2.0" | "3.0" | "4.0" | "5.0" | "2.0 and above";

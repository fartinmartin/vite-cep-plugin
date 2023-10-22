import { CopyModulesArgs, copyModules } from "./copy-modules";

const rollupNodeCopyPlugin = ({
  packages,
  src,
  dest,
  symlink,
}: CopyModulesArgs) => {
  return {
    name: "copy-node-modules",
    buildEnd: async () => {
      copyModules({ packages, src, dest, symlink });
    },
  };
};

export default rollupNodeCopyPlugin;
export * from "./copy-files";
export * from "./copy-modules";
export * from "./node-solve";

import path from "path";

export const getRootDirectory = () => {
  let projectRoot: string;
  projectRoot = path.join(process.cwd());
  return projectRoot;
};

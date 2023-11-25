import path from "path";

export const getRootDirectory = () => {
  const projectRoot = path.join(process.cwd());
  return projectRoot;
};

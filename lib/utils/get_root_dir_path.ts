import path from "path";
import { config } from "dotenv";
config();

export const getRootDirectory = () => {
  let projectRoot: string;
  projectRoot =
    process.env?.mode === "dev"
      ? path.join(process.cwd(), "src")
      : path.join(process.cwd());
  return projectRoot;
};

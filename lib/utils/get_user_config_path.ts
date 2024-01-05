import { existsSync } from "fs";
import path from "path";
import { getRootDirectory } from "./get_root_dir_path.js";

export const getUserConfigFilePath = () => {
  const userConfigFilePath = path.join(getRootDirectory(), "dolph_cli.yaml");

  if (existsSync(userConfigFilePath)) {
    return userConfigFilePath;
  }

  return path.join(userConfigFilePath, "../../", "dolph_cli.yaml");
};

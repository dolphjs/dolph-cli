import { existsSync } from "fs";
import path from "path";

export const getUserConfigFilePath = () => {
  const userConfigFolderPath = path.join(process.cwd());
  const userConfigFilePath = path.join(userConfigFolderPath, "dolph_cli.yaml");

  if (existsSync(userConfigFilePath)) {
    return userConfigFilePath;
  }

  return path.join(userConfigFilePath, "../../", "dolph_cli.yaml");
};

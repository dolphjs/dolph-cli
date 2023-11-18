import { existsSync } from "fs";
import path from "path";

export const getUserConfigFilePath = () => {
  const userConfigFolderPath = path.join(process.cwd(), "dolph-cli");
  const userConfigFilePath = path.join(userConfigFolderPath, "dolph-cli.yaml");

  if (existsSync(userConfigFilePath)) {
    return userConfigFilePath;
  }

  return path.join(userConfigFilePath, "../../", "config", "dolph-cli.yaml");
};

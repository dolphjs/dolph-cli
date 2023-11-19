import { existsSync, mkdirSync, writeFile } from "fs";
import path from "path";
import colors from "colors";
import { readConfig } from "../utils/read_user_config_path.js";
import { resolveMySqlContent } from "./resolvers/resolve_model_content.js";

const findConfigDirectory = () => {
  const rootDir = process.cwd();
  const possibleDirs = [
    "/src/Configs",
    "/src/Config",
    "/src/configs",
    "/src/config",
    "/Configs",
    "/configs",
    "/config",
    "/Config",
  ];

  const configDir = possibleDirs.find((dir) =>
    existsSync(path.join(rootDir, dir))
  );
  return configDir ? path.join(rootDir, configDir) : null;
};

export const generateConfigFile = async (
  name: string,
  configDir: string,
  readConfig: any
) => {
  await writeFile(configDir, resolveMySqlContent(readConfig), (error) => {
    if (error) {
      console.log(colors.bold(colors.red(error.toString())));
    }
  });
};

export const generateConfig = async (name: string) => {
  if (!name)
    colors.bold(colors.red("Config extension or name is required! 🤨"));

  const configDir = findConfigDirectory();

  if (!configDir) {
    //TODO: create one if it doesn't exist

    console.log(colors.bold(colors.red("Config directory doesn't exist 🤨")));
    return;
  }

  const configDirName =
    readConfig().generateFolder === "true" || true
      ? path.join(configDir, name)
      : configDir;

  const configFilePath = path.join(
    configDirName + `/db.configs.${readConfig().language}`
  );

  try {
    // Create the generate controller path
    if (readConfig().generateFolder === "true" || true) {
      mkdirSync(configDirName);
    }

    //TODO: if no index.ts file, create one too

    generateConfigFile(
      name,
      path.join(configFilePath),
      readConfig
      // configDirName,
    );
  } catch (e: any) {
    console.log(colors.bold(colors.red(e)));
  }

  console.log(
    `${colors.bold(
      colors.green(
        `db.config.${readConfig().language} generated successfully! 🙃`
      )
    )}`
  );
};

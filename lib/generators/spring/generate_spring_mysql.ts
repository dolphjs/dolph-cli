import { existsSync, mkdirSync, writeFile } from "fs";
import path from "path";
import chalk from "chalk";
import { promisify } from "util";
import { readConfig } from "../../utils/read_user_config_path.js";
import { resolveMySqlContent } from "./../resolvers/resolve_model_content.js";

const writeFileAsync = promisify(writeFile);

const createConfigDirectory = () => {
  const projectRoot = path.join(process.cwd());
  const userConfigFilePath = path.join(projectRoot, "/src/shared/configs");

  if (!existsSync(userConfigFilePath)) {
    mkdirSync(userConfigFilePath);
  }
};

const findConfigDirectory = () => {
  const rootDir = process.cwd();
  const possibleDirs = ["/src/shared/configs"];

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
  try {
    await writeFileAsync(configDir, resolveMySqlContent(readConfig));
    console.log(
      `${chalk.bold(
        chalk.green(
          `db.config.${readConfig().language} generated successfully! 🙃`
        )
      )}`
    );
  } catch (error) {
    console.log(chalk.bold(chalk.red(error.toString())));
  }
};

export const generateConfig = async (name: string) => {
  if (!name) {
    console.log(
      chalk.bold(chalk.red("Config extension or name is required! 🤨"))
    );
    return;
  }

  let configDir = findConfigDirectory();

  if (!configDir) {
    createConfigDirectory();
    configDir = findConfigDirectory();
  }

  const configDirName = configDir;
  const configFilePath = path.join(
    configDirName + `/db.configs.${readConfig().language}`
  );

  try {
    await generateConfigFile(name, path.join(configFilePath), readConfig);
  } catch (e: any) {
    console.log(chalk.bold(chalk.red(e)));
  }
};

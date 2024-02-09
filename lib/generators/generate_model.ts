import { existsSync, mkdirSync, writeFile } from "fs";
import path from "path";
import chalk from "chalk";
import { promisify } from "util";
import { readConfig } from "../utils/read_user_config_path.js";
import { resolveModelContent } from "./resolvers/resolve_model_content.js";
import { generateModel as generateSpringModel } from "./spring/generate_spring_model.js";

const writeFileAsync = promisify(writeFile);

const createModelDirectory = () => {
  const projectRoot = path.join(process.cwd());
  const userModelFilePath = path.join(projectRoot, "/src/models");

  if (!existsSync(userModelFilePath)) {
    mkdirSync(userModelFilePath);
  }
};

const findModelDirectory = () => {
  const rootDir = process.cwd();
  const possibleDirs = ["/src/models"];

  const modelDir = possibleDirs.find((dir) =>
    existsSync(path.join(rootDir, dir))
  );
  return modelDir ? path.join(rootDir, modelDir) : null;
};

export const generateModelFile = async (
  name: string,
  modelDir: string,
  readConfig: any
) => {
  try {
    await writeFileAsync(modelDir, resolveModelContent(readConfig, name));
    console.log(
      `${chalk.bold(
        chalk.green(
          `${name}.model.${readConfig().language} generated successfully! 🙃`
        )
      )}`
    );
  } catch (error) {
    console.log(chalk.bold(chalk.red(error.toString())));
  }
};

export const generateModel = async (name: string) => {
  if (readConfig().routing === "spring") {
    generateSpringModel(
      name,
      readConfig().database === "mongo" ? true : false,
      readConfig().database === "mysql" ? true : false
    );
  } else {
    if (!name) {
      console.log(
        chalk.bold(chalk.red("Model extension or name is required! 🤨"))
      );
      return;
    }

    let modelDir = findModelDirectory();

    if (!modelDir) {
      createModelDirectory();
      modelDir = findModelDirectory();
    }

    const modelDirName = path.join(modelDir, name);
    const modelFilePath = path.join(
      modelDirName + `/${name}.model.${readConfig().language}`
    );

    try {
      mkdirSync(modelDirName);
      generateModelFile(name, path.join(modelFilePath), readConfig);
    } catch (e: any) {
      console.log(chalk.bold(chalk.red(e)));
    }
  }
};

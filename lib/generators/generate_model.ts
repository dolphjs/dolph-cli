import { existsSync, mkdirSync, writeFile } from "fs";
import path from "path";
import chalk from "chalk";
import { readConfig } from "../utils/read_user_config_path.js";
import { resolveModelContent } from "./resolvers/resolve_model_content.js";

const createModelDirectory = () => {
  const projectRoot = path.join(process.cwd());
  const userModelFilePath = path.join(projectRoot, "/src/models");

  if (!existsSync(userModelFilePath)) {
    mkdirSync(userModelFilePath);
  }
};

// removed other possible dirs to enforce dolphjs style guide

const findModelDirectory = () => {
  const rootDir = process.cwd();
  const possibleDirs = [
    "/src/models",
    // "/src/Models",
    // "/src/model",
    // "/src/Model",
    // "/Models",
    // "/Model",
    // "/models",
    // "/model",
  ];

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
  await writeFile(modelDir, resolveModelContent(readConfig, name), (error) => {
    if (error) {
      console.log(chalk.bold(chalk.red(error.toString())));
    }
  });
};

export const generateModel = async (name: string) => {
  if (!name) chalk.bold(chalk.red("Model extension or name is required! 🤨"));

  let modelDir = findModelDirectory();

  if (!modelDir) {
    //TODO: create one if it doesn't exist

    // console.log(chalk.bold(chalk.red("Model directory doesn't exist 🤨")));
    // return;
    createModelDirectory();
    modelDir = findModelDirectory();
  }

  const modelDirName = path.join(modelDir, name);

  const modelFilePath = path.join(
    modelDirName + `/${name}.model.${readConfig().language}`
  );

  try {
    // Create the generate controller path
    mkdirSync(modelDirName);

    //TODO: if no index.ts file, create one too

    generateModelFile(
      name,
      path.join(modelFilePath),
      readConfig
      // modelDirName,
    );
  } catch (e: any) {
    console.log(chalk.bold(chalk.red(e)));
  }

  console.log(
    `${chalk.bold(
      chalk.green(
        `${name}.model.${readConfig().language} generated successfully! 🙃`
      )
    )}`
  );
};

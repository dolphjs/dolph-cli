import { existsSync, mkdirSync, writeFile } from "fs";
import path from "path";
import chalk from "chalk";
import { readConfig } from "../utils/read_user_config_path.js";
import { resolveControllerContent } from "./resolvers/resolve_controller_content.js";

const createControllerDirectory = () => {
  const projectRoot = path.join(process.cwd());
  const userControllerFilePath = path.join(projectRoot, "/src/controllers");

  if (!existsSync(userControllerFilePath)) {
    mkdirSync(userControllerFilePath);
  }
};

// removed other possible dirs to enforce dolphjs style guide
const findControllerDirectory = () => {
  const rootDir = process.cwd();
  const possibleDirs = [
    "/src/controllers",
    // "/src/Controllers",
    // "/src/controller",
    // "/src/Controller",
    // "/Controller",
    // "/Controllers",
    // "/controllers",
    // "/controller",
  ];

  const controllerDir = possibleDirs.find((dir) =>
    existsSync(path.join(rootDir, dir))
  );
  return controllerDir ? path.join(rootDir, controllerDir) : null;
};

export const generateControllerFile = async (
  name: string,
  controllerDir: string,
  readConfig: any
) => {
  await writeFile(
    controllerDir,
    resolveControllerContent(readConfig, name),
    (error) => {
      if (error) {
        console.log(chalk.bold(chalk.red(error.toString())));
      }
    }
  );
};

export const generateController = async (name: string) => {
  if (!name)
    chalk.bold(chalk.red("Controller extension or name is required! 🤨"));

  let controllerDir = findControllerDirectory();

  if (!controllerDir) {
    //TODO: create one if it doesn't exist

    // console.log(
    //   chalk.bold(chalk.red("controller directory doesn't exist 🤨"))
    // );
    // return;

    createControllerDirectory();
    controllerDir = findControllerDirectory();
  }

  const controllerDirName = path.join(controllerDir, name);

  const controllerFilePath = path.join(
    controllerDirName + `/${name}.controller.${readConfig().language}`
  );

  try {
    // Create the generate controller path
    if (readConfig().generateFolder === "true" || true) {
      mkdirSync(controllerDirName);
    }

    //TODO: if no index.ts file, create one too

    generateControllerFile(
      name,
      path.join(controllerFilePath),
      readConfig
      // controllerDirName,
    );
  } catch (e: any) {
    console.log(chalk.bold(chalk.red(e)));
  }

  console.log(
    `${chalk.bold(
      chalk.green(
        `${name}.controller.${readConfig().language} generated successfully! 🙃`
      )
    )}`
  );
};

import { existsSync, mkdirSync, writeFile } from "fs";
import path from "path";
import chalk from "chalk";
import { promisify } from "util";
import { readConfig } from "../utils/read_user_config_path.js";
import { resolveControllerContent } from "./resolvers/resolve_controller_content.js";
import { generateController as generateSpringController } from "./spring/generate_spring_controller.js";
import { addControllerInComponentFIle } from "../registers/register_controllers_in_components.js";

const writeFileAsync = promisify(writeFile);

const createControllerDirectory = () => {
  const projectRoot = path.join(process.cwd());
  const userControllerFilePath = path.join(projectRoot, "/src/controllers");

  if (!existsSync(userControllerFilePath)) {
    mkdirSync(userControllerFilePath);
  }
};

const findControllerDirectory = () => {
  const rootDir = process.cwd();
  const possibleDirs = ["/src/controllers"];

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
  try {
    await writeFileAsync(
      controllerDir,
      resolveControllerContent(readConfig, name)
    );
    console.log(
      `${chalk.bold(
        chalk.green(
          `${name}.controller.${
            readConfig().language
          } generated successfully! 🙃`
        )
      )}`
    );
  } catch (error) {
    console.log(chalk.bold(chalk.red(error.toString())));
  }
};

export const generateController = async (name: string) => {
  if (readConfig().routing === "spring") {
    await generateSpringController(name);
    addControllerInComponentFIle(name);
  } else {
    if (!name) {
      console.log(
        chalk.bold(chalk.red("Controller extension or name is required! 🤨"))
      );
      return;
    }

    let controllerDir = findControllerDirectory();

    if (!controllerDir) {
      createControllerDirectory();
      controllerDir = findControllerDirectory();
    }

    const controllerDirName = path.join(controllerDir, name);
    const controllerFilePath = path.join(
      controllerDirName + `/${name}.controller.${readConfig().language}`
    );

    try {
      if (readConfig().generateFolder === "true" || true) {
        mkdirSync(controllerDirName);
      }

      await generateControllerFile(
        name,
        path.join(controllerFilePath),
        readConfig
      );
    } catch (e: any) {
      console.log(chalk.bold(chalk.red(e)));
    }
  }
};

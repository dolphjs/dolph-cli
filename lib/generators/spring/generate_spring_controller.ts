import { existsSync, mkdirSync, writeFile } from "fs";
import path from "path";
import chalk from "chalk";
import { generateSpringController } from "../../generators/templates/spring_controller_template.js";
import { dolphMsg } from "../../helpers/messages.js";

const createControllerDirectory = (componentName: string) => {
  const projectRoot = path.join(process.cwd());
  const userCompontrollerPath = path.join(projectRoot, `/src/${componentName}`);

  if (!existsSync(userCompontrollerPath)) {
    mkdirSync(userCompontrollerPath);
  }
};

const findControllerDirectory = (componentName: string) => {
  const rootDir = process.cwd();
  const possibleDirs = [`src/${componentName}`];

  const controllerDir = possibleDirs.find((dir) =>
    existsSync(path.join(rootDir, dir))
  );

  return controllerDir ? path.join(rootDir, controllerDir) : null;
};

export const generateSpringControllerFile = async (
  componentName: string,
  controllerDir: string
) => {
  await writeFile(
    controllerDir,
    generateSpringController(componentName),
    (error) => {
      if (error) {
        dolphMsg.errorRed(error.toString());
      }
    }
  );
};

export const generateController = async (name: string) => {
  if (!name) dolphMsg.errorRed("controller extension or name is required! 🤨");

  let controllerDir = findControllerDirectory(name);

  if (!controllerDir) {
    createControllerDirectory(name);
    controllerDir = findControllerDirectory(name);
  }

  const controllerFilePath = path.join(
    controllerDir + `/${name}.controller.ts`
  );

  try {
    generateSpringControllerFile(name, path.join(controllerFilePath));
  } catch (e: any) {
    dolphMsg.errorRed(e);
  }

  dolphMsg.info(
    `${chalk.blue(
      `${name}.controller.ts`
    )} generated successfully for ${chalk.blue(`${name}`)} component.`
  );
};

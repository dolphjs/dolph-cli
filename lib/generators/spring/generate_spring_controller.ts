import { existsSync, mkdirSync, writeFile } from "fs";
import path from "path";
import chalk from "chalk";
import { generateSpringController } from "../../generators/templates/spring_controller_template.js";
import { dolphMsg } from "../../helpers/messages.js";
import { promisify } from "util";

const writeFileAsync = promisify(writeFile);

const createControllerDirectory = (componentName: string) => {
  const projectRoot = path.join(process.cwd());
  const userCompontrollerPath = path.join(
    projectRoot,
    `/src/components/${componentName}`
  );

  if (!existsSync(userCompontrollerPath)) {
    mkdirSync(userCompontrollerPath);
  }
};

const findControllerDirectory = (componentName: string) => {
  const rootDir = process.cwd();
  const possibleDirs = [`src/components/${componentName}`];

  const controllerDir = possibleDirs.find((dir) =>
    existsSync(path.join(rootDir, dir))
  );

  return controllerDir ? path.join(rootDir, controllerDir) : null;
};

export const generateSpringControllerFile = async (
  componentName: string,
  controllerDir: string
) => {
  try {
    await writeFileAsync(
      controllerDir,
      generateSpringController(componentName)
    );
  } catch (error) {
    dolphMsg.errorRed(error.toString());
  }
};

export const generateController = async (name: string) => {
  if (!name) {
    dolphMsg.errorRed("Controller extension or name is required! 🤨");
    return;
  }

  let controllerDir = findControllerDirectory(name);

  if (!controllerDir) {
    createControllerDirectory(name);
    controllerDir = findControllerDirectory(name);
  }

  const controllerFilePath = path.join(
    controllerDir + `/${name}.controller.ts`
  );

  try {
    await generateSpringControllerFile(name, path.join(controllerFilePath));
    dolphMsg.info(
      `${chalk.blue(
        `${name}.controller.ts`
      )} generated successfully for ${chalk.blue(`${name}`)} component.`
    );
  } catch (e: any) {
    dolphMsg.errorRed(e);
  }
};

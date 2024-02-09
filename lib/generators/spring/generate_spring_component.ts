import { existsSync, mkdirSync, writeFile } from "fs";
import path from "path";
import chalk from "chalk";
import { generateSpringComponent } from "../../generators/templates/spring_component_template.js";
import { dolphMsg } from "../../helpers/messages.js";
import { promisify } from "util";

const writeFileAsync = promisify(writeFile);

const createComponentDirectory = (componentName: string) => {
  const projectRoot = path.join(process.cwd());
  const userComponentPath = path.join(projectRoot, `/src/${componentName}`);

  if (!existsSync(userComponentPath)) {
    mkdirSync(userComponentPath);
  }
};

const findComponentDirectory = (componentName: string) => {
  const rootDir = process.cwd();
  const possibleDirs = [`src/${componentName}`];

  const componentDir = possibleDirs.find((dir) =>
    existsSync(path.join(rootDir, dir))
  );

  return componentDir ? path.join(rootDir, componentDir) : null;
};

export const generateSpringComponentFile = async (
  componentName: string,
  componentDir: string
) => {
  try {
    await writeFileAsync(componentDir, generateSpringComponent(componentName));
  } catch (error) {
    dolphMsg.errorRed(error.toString());
  }
};

export const generateComponent = async (name: string) => {
  if (!name) {
    dolphMsg.errorRed("Component extension or name is required! 🤨");
    return;
  }

  let componentDir = findComponentDirectory(name);

  if (!componentDir) {
    createComponentDirectory(name);
    componentDir = findComponentDirectory(name);
  }

  const componentFilePath = path.join(componentDir + `/${name}.component.ts`);

  try {
    await generateSpringComponentFile(name, path.join(componentFilePath));
    dolphMsg.info(
      `${chalk.blue(
        `${name}.component.ts`
      )} generated successfully for ${chalk.blue(`${name}`)} component.`
    );
  } catch (e: any) {
    dolphMsg.errorRed(e);
  }
};

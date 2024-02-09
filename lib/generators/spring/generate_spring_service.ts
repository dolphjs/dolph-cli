import { existsSync, mkdirSync, writeFile } from "fs";
import path from "path";
import chalk from "chalk";
import { generateSpringService } from "../../generators/templates/spring_service_template.js";
import { dolphMsg } from "../../helpers/messages.js";
import { promisify } from "util";

const writeFileAsync = promisify(writeFile);

const createServiceDirectory = (componentName: string) => {
  const projectRoot = path.join(process.cwd());
  const userServicePath = path.join(
    projectRoot,
    `/src/components/${componentName}`
  );

  if (!existsSync(userServicePath)) {
    mkdirSync(userServicePath);
  }
};

const findServiceDirectory = (componentName: string) => {
  const rootDir = process.cwd();
  const possibleDirs = [`src/components/${componentName}`];

  const serviceDir = possibleDirs.find((dir) =>
    existsSync(path.join(rootDir, dir))
  );

  return serviceDir ? path.join(rootDir, serviceDir) : null;
};

export const generateSpringServiceFile = async (
  componentName: string,
  serviceDir: string,
  isMongo: boolean,
  isMySql: boolean
) => {
  try {
    await writeFileAsync(
      serviceDir,
      generateSpringService(componentName, isMongo, isMySql)
    );
  } catch (error) {
    dolphMsg.errorRed(error.toString());
  }
};

export const generateService = async (
  name: string,
  isMongo: boolean,
  isMySql: boolean
) => {
  if (!name) {
    dolphMsg.errorRed("Service extension or name is required! 🤨");
    return;
  }

  let serviceDir = findServiceDirectory(name);

  if (!serviceDir) {
    createServiceDirectory(name);
    serviceDir = findServiceDirectory(name);
  }

  const serviceFilePath = path.join(serviceDir + `/${name}.service.ts`);

  try {
    await generateSpringServiceFile(
      name,
      path.join(serviceFilePath),
      isMongo,
      isMySql
    );
    dolphMsg.info(
      `${chalk.blue(
        `${name}.service.ts`
      )} generated successfully for ${chalk.blue(`${name}`)} component.`
    );
  } catch (e: any) {
    dolphMsg.errorRed(e);
  }
};

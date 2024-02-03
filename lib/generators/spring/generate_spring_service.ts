import { existsSync, mkdirSync, writeFile } from "fs";
import path from "path";
import chalk from "chalk";
import { generateSpringService } from "../../generators/templates/spring_service_template.js";
import { dolphMsg } from "../../helpers/messages.js";

const createServiceDirectory = (componentName: string) => {
  const projectRoot = path.join(process.cwd());
  const userServicePath = path.join(projectRoot, `/src/${componentName}`);

  if (!existsSync(userServicePath)) {
    mkdirSync(userServicePath);
  }
};

const findServiceDirectory = (componentName: string) => {
  const rootDir = process.cwd();
  const possibleDirs = [`src/${componentName}`];

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
  await writeFile(
    serviceDir,
    generateSpringService(componentName, isMongo, isMySql),
    (error) => {
      if (error) {
        dolphMsg.errorRed(error.toString());
      }
    }
  );
};

export const generateService = async (
  name: string,
  isMongo: boolean,
  isMySql: boolean
) => {
  if (!name) dolphMsg.errorRed("service extension or name is required! 🤨");

  let serviceDir = findServiceDirectory(name);

  if (!serviceDir) {
    createServiceDirectory(name);
    serviceDir = findServiceDirectory(name);
  }

  const serviceFilePath = path.join(serviceDir + `/${name}.service.ts`);

  try {
    generateSpringServiceFile(
      name,
      path.join(serviceFilePath),
      isMongo,
      isMySql
    );
  } catch (e: any) {
    dolphMsg.errorRed(e);
  }

  dolphMsg.info(
    `${chalk.blue(
      `${name}.service.ts`
    )} generated successfully for ${chalk.blue(`${name}`)} component.`
  );
};

import { existsSync, mkdirSync, writeFile } from "fs";
import path from "path";
import chalk from "chalk";
import { readConfig } from "../utils/read_user_config_path.js";
import { resolveServiceContent } from "./resolvers/resolve_service_content.js";
import { generateService as generateSpringService } from "./spring/generate_spring_service.js";

const createServiceDirectory = () => {
  const projectRoot = path.join(process.cwd());
  const userServiceFilePath = path.join(projectRoot, "/src/services");

  if (!existsSync(userServiceFilePath)) {
    mkdirSync(userServiceFilePath);
  }
};

// removed other possible dirs to enforce dolphjs style guide
const findServiceDirectory = () => {
  const rootDir = process.cwd();
  const possibleDirs = [
    "/src/services",
    // "/src/Services",
    // "/src/service",
    // "/src/Services",
    // "/Service",
    // "/Services",
    // "/services",
    // "/service",
  ];

  const serviceDir = possibleDirs.find((dir) =>
    existsSync(path.join(rootDir, dir))
  );
  return serviceDir ? path.join(rootDir, serviceDir) : null;
};

export const generateServiceFile = async (
  name: string,
  serviceDir: string,
  readConfig: any
) => {
  await writeFile(
    serviceDir,
    resolveServiceContent(readConfig, name),
    (error) => {
      if (error) {
        console.log(chalk.bold(chalk.red(error.toString())));
      }
    }
  );
};

export const generateService = async (name: string) => {
  if (readConfig().routing === "spring") {
    generateSpringService(
      name,
      readConfig().database === "mongo" ? true : false,
      readConfig().database === "mysql" ? true : false
    );
  }
  {
    if (!name)
      chalk.bold(chalk.red("Service extension or name is required! 🤨"));

    let serviceDir = findServiceDirectory();

    if (!serviceDir) {
      //TODO: create one if it doesn't exist

      // console.log(chalk.bold(chalk.red("Service directory doesn't exist 🤨")));
      // return;
      createServiceDirectory();
      serviceDir = findServiceDirectory();
    }

    const serviceDirName = path.join(serviceDir, name);

    const serviceFilePath = path.join(
      serviceDirName + `/${name}.service.${readConfig().language}`
    );

    try {
      // Create the generate controller path
      if (readConfig().generateFolder === "true" || true) {
        mkdirSync(serviceDirName);
      }

      //TODO: if no index.ts file, create one too

      generateServiceFile(
        name,
        path.join(serviceFilePath),
        readConfig
        // serviceDirName,
      );
    } catch (e: any) {
      console.log(chalk.bold(chalk.red(e)));
    }
  }

  console.log(
    `${chalk.bold(
      chalk.green(
        `${name}.service.${readConfig().language} generated successfully! 🙃`
      )
    )}`
  );
};

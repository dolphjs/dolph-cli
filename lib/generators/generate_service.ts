import { existsSync, mkdirSync, writeFile } from "fs";
import path from "path";
import chalk from "chalk";
import { promisify } from "util";
import { readConfig } from "../utils/read_user_config_path.js";
import { resolveServiceContent } from "./resolvers/resolve_service_content.js";
import { generateService as generateSpringService } from "./spring/generate_spring_service.js";

const writeFileAsync = promisify(writeFile);

const createServiceDirectory = () => {
  const projectRoot = path.join(process.cwd());
  const userServiceFilePath = path.join(projectRoot, "/src/services");

  if (!existsSync(userServiceFilePath)) {
    mkdirSync(userServiceFilePath);
  }
};

const findServiceDirectory = () => {
  const rootDir = process.cwd();
  const possibleDirs = ["/src/services"];

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
  try {
    await writeFileAsync(serviceDir, resolveServiceContent(readConfig, name));
    console.log(
      `${chalk.bold(
        chalk.green(
          `${name}.service.${readConfig().language} generated successfully! 🙃`
        )
      )}`
    );
  } catch (error) {
    console.log(chalk.bold(chalk.red(error.toString())));
  }
};

export const generateService = async (name: string) => {
  if (readConfig().routing === "spring") {
    await generateSpringService(
      name,
      readConfig().database === "mongo" ? true : false,
      readConfig().database === "mysql" ? true : false
    );
  } else {
    if (!name) {
      console.log(
        chalk.bold(chalk.red("Service extension or name is required! 🤨"))
      );
      return;
    }

    let serviceDir = findServiceDirectory();

    if (!serviceDir) {
      createServiceDirectory();
      serviceDir = findServiceDirectory();
    }

    const serviceDirName = path.join(serviceDir, name);
    const serviceFilePath = path.join(
      serviceDirName + `/${name}.service.${readConfig().language}`
    );

    try {
      if (readConfig().generateFolder === "true" || true) {
        mkdirSync(serviceDirName);
      }

      await generateServiceFile(name, path.join(serviceFilePath), readConfig);
    } catch (e: any) {
      console.log(chalk.bold(chalk.red(e)));
    }
  }
};

import { existsSync, mkdirSync, writeFile } from "fs";
import path from "path";
import colors from "colors";
import { readConfig } from "../utils/read_user_config_path.js";
import { resolveServiceContent } from "./resolvers/resolve_service_content.js";

const findServiceDirectory = () => {
  const rootDir = process.cwd();
  const possibleDirs = [
    "/src/services",
    "/src/Services",
    "/src/service",
    "/src/Services",
    "/Service",
    "/Services",
    "/services",
    "/service",
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
        console.log(colors.bold(colors.red(error.toString())));
      }
    }
  );
};

export const generateService = async (name: string) => {
  if (!name)
    colors.bold(colors.red("Service extension or name is required! 🤨"));

  const serviceDir = findServiceDirectory();

  if (!serviceDir) {
    //TODO: create one if it doesn't exist

    console.log(colors.bold(colors.red("Service directory doesn't exist 🤨")));
    return;
  }

  const serviceDirName =
    readConfig().generateFolder === "true" || true
      ? path.join(serviceDir, name)
      : serviceDir;

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
    console.log(colors.bold(colors.red(e)));
  }

  console.log(
    `${colors.bold(
      colors.green(
        `${name}.service.${readConfig().language} generated successfully! 🙃`
      )
    )}`
  );
};

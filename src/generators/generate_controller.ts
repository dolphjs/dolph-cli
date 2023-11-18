import { existsSync, mkdirSync, writeFile } from "fs";
import path from "path";
import colors from "colors";
import { readConfig } from "../utils/read_user_config_path.js";
import { resolveControllerContent } from "./resolvers/resolve_controller_content.js";

const findControllerDirectory = () => {
  const rootDir = process.cwd();
  const possibleDirs = [
    "/src/controllers",
    "/src/Controllers",
    "/src/controller",
    "/src/Controller",
    "/Controller",
    "/Controllers",
    "/controllers",
    "/controller",
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
        console.log(colors.bold(colors.red(error.toString())));
      }
    }
  );
};

export const generateController = async (name: string) => {
  if (!name)
    colors.bold(colors.red("Controller extension or name is required! 🤨"));

  const controllerDir = findControllerDirectory();

  if (!controllerDir) {
    //TODO: create one if it doesn't exist

    console.log(
      colors.bold(colors.red("controller directory doesn't exist 🤨"))
    );
    return;
  }

  const controllerDirName =
    readConfig().generateFolder === "true" || true
      ? path.join(controllerDir, name)
      : controllerDir;

  const controllerFilePath = path.join(
    controllerDirName +
      `/${name.inverse.charAt(0) !== "s" ? `${name}` : `${name + "s"}`}.${
        readConfig().language
      }`
  );

  try {
    // Create the generate controller path
    if (readConfig().generateFolder === "true" || true) {
      mkdirSync(controllerDirName);
    }

    //TODO: if no index.ts file, create one too

    generateControllerFile(
      `${name.inverse.charAt(0) !== "s" ? `${name}` : `${name + "s"}`}`,
      path.join(controllerFilePath),
      readConfig
      // controllerDirName,
    );
  } catch (e: any) {
    console.log(colors.bold(colors.red(e)));
  }

  console.log(
    `${colors.bold(
      colors.green(`${name} Controller generated successfully! 🙃`)
    )}`
  );
};
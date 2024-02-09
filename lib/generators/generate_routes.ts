import { existsSync, mkdirSync, writeFile } from "fs";
import path from "path";
import chalk from "chalk";
import { promisify } from "util";
import { readConfig } from "../utils/read_user_config_path.js";
import { resolveRoutesContent } from "./resolvers/resolve_routes_content.js";

const writeFileAsync = promisify(writeFile);

const createRoutesDirectory = () => {
  const projectRoot = path.join(process.cwd());
  const userRoutesFilePath = path.join(projectRoot, "/src/routes");

  if (!existsSync(userRoutesFilePath)) {
    mkdirSync(userRoutesFilePath);
  }
};

const findRoutesDirectory = () => {
  const rootDir = process.cwd();
  const possibleDirs = ["/src/routes"];

  const routesDir = possibleDirs.find((dir) =>
    existsSync(path.join(rootDir, dir))
  );
  return routesDir ? path.join(rootDir, routesDir) : null;
};

export const generateRoutesFile = async (
  name: string,
  routesDir: string,
  readConfig: any
) => {
  try {
    await writeFileAsync(routesDir, resolveRoutesContent(readConfig, name));
    console.log(
      `${chalk.bold(
        chalk.green(
          `${name}.routes.${readConfig().language} generated successfully! 🙃`
        )
      )}`
    );
  } catch (error) {
    console.log(chalk.bold(chalk.red(error.toString())));
  }
};

export const generateRouter = async (name: string) => {
  if (!name) {
    console.log(
      chalk.bold(chalk.red("Routes extension or name is required! 🤨"))
    );
    return;
  }

  let routesDir = findRoutesDirectory();

  if (!routesDir) {
    createRoutesDirectory();
    routesDir = findRoutesDirectory();
  }

  const routesDirName = path.join(routesDir, name);
  const routesFilePath = path.join(
    routesDirName + `/${name}.routes.${readConfig().language}`
  );

  try {
    if (readConfig().generateFolder === "true" || true) {
      mkdirSync(routesDirName);
    }

    generateRoutesFile(name, path.join(routesFilePath), readConfig);
  } catch (e: any) {
    console.log(chalk.bold(chalk.red(e)));
  }
};

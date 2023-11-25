import { existsSync, mkdirSync, writeFile } from "fs";
import path from "path";
import colors from "colors";
import { readConfig } from "../utils/read_user_config_path.js";
import { resolveRoutesContent } from "./resolvers/resolve_routes_content.js";

const createRoutesDirectory = () => {
  const projectRoot = path.join(process.cwd());
  const userRoutesFilePath = path.join(projectRoot, "/src/routes");

  if (!existsSync(userRoutesFilePath)) {
    mkdirSync(userRoutesFilePath);
  }
};

// removed other possible dirs to enforce dolphjs style guide
const findRoutesDirectory = () => {
  const rootDir = process.cwd();
  const possibleDirs = [
    "/src/routes",
    // "/src/Routes",
    // "/Routes",
    // "/routes"
  ];

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
  await writeFile(
    routesDir,
    resolveRoutesContent(readConfig, name),
    (error) => {
      if (error) {
        console.log(colors.bold(colors.red(error.toString())));
      }
    }
  );
};

export const generateRouter = async (name: string) => {
  if (!name)
    colors.bold(colors.red("Routes extension or name is required! 🤨"));

  let routesDir = findRoutesDirectory();

  if (!routesDir) {
    //TODO: create one if it doesn't exist

    // console.log(colors.bold(colors.red("routes directory doesn't exist 🤨")));
    // return;
    createRoutesDirectory();
    routesDir = findRoutesDirectory();
  }

  const routesDirName = path.join(routesDir, name);

  const routesFilePath = path.join(
    routesDirName + `/${name}.routes.${readConfig().language}`
  );

  try {
    // Create the generate controller path
    if (readConfig().generateFolder === "true" || true) {
      mkdirSync(routesDirName);
    }

    //TODO: if no index.ts file, create one too

    generateRoutesFile(
      name,
      path.join(routesFilePath),
      readConfig
      // routesDirName,
    );
  } catch (e: any) {
    console.log(colors.bold(colors.red(e)));
  }

  console.log(
    `${colors.bold(
      colors.green(
        `${name}.routes.${readConfig().language} generated successfully! 🙃`
      )
    )}`
  );
};

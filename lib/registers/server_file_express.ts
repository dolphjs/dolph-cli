import chalk from "chalk";
import { existsSync, writeFileSync } from "fs";
import path from "path";

// removed other possible dirs to enforce dolphjs style guide
const findBaseDirectory = () => {
  const rootDir = process.cwd();
  const possibleDirs = [
    "/src",
    //  "/"
  ];

  const routesDir = possibleDirs.find((dir) =>
    existsSync(path.join(rootDir, dir))
  );
  return routesDir ? path.join(rootDir, routesDir) : null;
};

export const addServerFile = (readConfig: any) => {
  let extension: string;
  let database: string;

  extension = readConfig().language;
  database = readConfig().database;

  const baseDirectory = findBaseDirectory();

  const indexPath = path.join(baseDirectory, `server.${extension}`);

  let importStatement = ``;
  let otherFileContent = "";

  if (extension === "ts" && database === "mysql") {
    importStatement = `import { DolphFactory } from "@dolphjs/dolph";
import { routes } from "./routes";
import { sequelizeInstance } from "@/configs/db.configs";
import { autoInitMySql } from "@dolphjs/dolph/packages";
`;
  } else if (extension === "ts") {
    importStatement = `import { DolphFactory } from "@dolphjs/dolph";
import { routes } from "./routes";`;
  } else if (extension === "js" && database === "mysql") {
    importStatement = `const { DolphFactory } = require("@dolphjs/dolph");
const { routes } = require("./routes");
const { sequelizeInstance } = require("@/configs/db.configs");
const { autoInitMySql } = require("@dolphjs/dolph/packages");
`;
  } else if (extension === "js") {
    importStatement = `const { DolphFactory } = require("@dolphjs/dolph");
const { routes } = require("./routes");`;
  } else {
    console.log(
      chalk.bold(
        chalk.red("dolphjs only supports '.js' & '.ts' file extensions ")
      )
    );
  }

  if (database === "mysql") {
    otherFileContent = `const dolph = new DolphFactory(routes, []);
autoInitMySql(sequelizeInstance);

dolph.start();`;
  } else {
    otherFileContent = `const dolph = new DolphFactory(routes, []);
dolph.start();`;
  }

  try {
    // check if file exists
    if (!existsSync(indexPath)) {
      // if it doesn't exist, create file and add import statement
      const fileContent = `${importStatement}\n\n${otherFileContent}\n`;
      writeFileSync(indexPath, fileContent);
    } else {
      const fileContent = `${importStatement}\n\n${otherFileContent}\n`;
      writeFileSync(indexPath, fileContent);
    }

    console.log(
      chalk.bold(
        chalk.green(`added server.${extension} file to base directory`)
      )
    );
  } catch (e: any) {
    console.log(chalk.bold(chalk.red(e)));
  }
};

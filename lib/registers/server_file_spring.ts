import chalk from "chalk";
import { existsSync, writeFileSync } from "fs";
import path from "path";

const findBaseDirectory = () => {
  const rootDir = process.cwd();
  const possibleDirs = ["/src"];

  const routesDir = possibleDirs.find((dir) =>
    existsSync(path.join(rootDir, dir))
  );
  return routesDir ? path.join(rootDir, routesDir) : null;
};

export const addServerFile = async (database: any, name: string) => {
  const baseDirectory = findBaseDirectory();

  const indexPath = path.join(baseDirectory, `server.ts`);

  let importStatement = ``;
  let otherFileContent = "";

  const capitalizedString = name.charAt(0).toUpperCase() + name.slice(1);

  if (database === "mysql" && name.length) {
    importStatement = `import { DolphFactory } from "@dolphjs/dolph";
import { ${capitalizedString}Component } from "./components/${name}/${name}.component.ts";
import { sequelizeInstance } from "@/shared/configs/db.configs";
import { autoInitMySql } from "@dolphjs/dolph/packages";
`;
  } else if (database === "mysql") {
    importStatement = `import { DolphFactory } from "@dolphjs/dolph";
import { sequelizeInstance } from "@/shared/configs/db.configs";
import { autoInitMySql } from "@dolphjs/dolph/packages";`;
  } else if (database === "mongo" && name.length) {
    importStatement = `import { DolphFactory } from "@dolphjs/dolph";
import { ${capitalizedString}Component } from "./components/${name}/${name}.component.ts";
`;
  } else if (database === "mongo") {
    importStatement = `import { DolphFactory } from "@dolphjs/dolph";
import { autoInitMySql } from "@dolphjs/dolph/packages";`;
  }

  if (database === "mysql" && name) {
    otherFileContent = `const dolph = new DolphFactory([${capitalizedString}Component]);
autoInitMySql(sequelizeInstance);

dolph.start();`;
  } else if (database === "mysql") {
    otherFileContent = `const dolph = new DolphFactory([]);
autoInitMySql(sequelizeInstance);

dolph.start();`;
  } else if (database === "mongo" && name) {
    otherFileContent = `const dolph = new DolphFactory([${capitalizedString}Component]);
dolph.start();`;
  } else if (database === "mongo") {
    otherFileContent = `const dolph = new DolphFactory([]);
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
  } catch (e: any) {
    console.log(chalk.bold(chalk.red(e)));
  }
};

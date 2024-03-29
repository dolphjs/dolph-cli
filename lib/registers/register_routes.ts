import chalk from "chalk";
import { existsSync, readFileSync, writeFileSync } from "fs";
import path from "path";

const findRoutesDirectory = () => {
  const rootDir = process.cwd();
  const possibleDirs = [
    "/src/routes",
    // "/src/Routes",
    // "/src/route",
    // "/src/Route",
    // "/Routes",
    // "/Route",
    // "/routes",
    // "/route",
  ];

  const routesDir = possibleDirs.find((dir) =>
    existsSync(path.join(rootDir, dir))
  );
  return routesDir ? path.join(rootDir, routesDir) : null;
};

export const addRoutesIndexFile = (routesName: string, readConfig: any) => {
  let extension: string;
  let paradigm: string;

  paradigm = readConfig().paradigm;
  switch (readConfig().language) {
    case "ts":
      extension = "ts";
      break;
    case "js":
      extension = "js";
      break;
    default:
      extension = "ts";
      break;
  }
  if (!routesName)
    chalk.bold(chalk.red("Routes extension or name is required! 🤨"));

  const routesDir = findRoutesDirectory();

  if (!routesDir) {
    //TODO: create one if it doesn't exist

    console.log(chalk.bold(chalk.red("Routes directory doesn't exist 🤨")));
    return;
  }

  const indexPath = path.join(routesDir, `index.${extension}`);
  let importStatement = ``;

  const capitalizedString =
    routesName.charAt(0).toUpperCase() + routesName.slice(1);

  if (extension === "ts") {
    importStatement = `import { ${capitalizedString}Router } from "./${routesName}/${routesName}.routes"; `;

    if (paradigm !== "oop") {
      importStatement = `import { ${routesName}Routes } from "./${routesName}/${routesName}.routes"; `;
    }
  } else if (extension === "js") {
    importStatement = `const { ${capitalizedString}Router } = require("./${routesName}/${routesName}.routes"); `;

    if (paradigm !== "oop") {
      importStatement = `const { ${routesName}Routes } = require("./${routesName}/${routesName}.routes"); `;
    }
  } else {
    console.log(
      chalk.bold(
        chalk.red("dolphjs only supports '.js' & '.ts' file extensions")
      )
    );
  }

  let routesArray = "";

  if (extension === "ts") {
    routesArray = `export const routes = [new ${capitalizedString}Router()]; `;

    if (paradigm !== "oop") {
      routesArray = `export const routes = [${routesName}Routes];`;
    }
  } else {
    routesArray = `const routes = [new ${capitalizedString}Router()]; 
module.exports  = { routes };
        `;

    if (paradigm !== "oop") {
      routesArray = `const routes = [${routesName}Routes];
module.exports  = { routes }; 
      `;
    }
  }

  try {
    // check if file exists
    if (!existsSync(indexPath)) {
      // if it doesn't exist, create file and add import statement
      const fileContent = `${importStatement}\n\n${routesArray}\n`;
      writeFileSync(indexPath, fileContent);
    } else {
      const fileContent = readFileSync(indexPath, "utf8");
      const newRouterInstance = `new ${capitalizedString}Router()`;
      const newRoutesInstance = `${routesName}Routes`;

      if (!fileContent.includes(importStatement)) {
        const updatedContent = `${importStatement}\n${fileContent}`;
        writeFileSync(indexPath, updatedContent);
      }

      if (
        fileContent.includes(
          `${extension === "ts" ? "export const routes" : "const routes"}`
        )
      ) {
        // add new routes instance to the exisiting routes array
        if (extension === "ts") {
          const routesArrayMatch = fileContent.match(
            /export const routes = \[([\s\S]+?)\];/
          );
          if (routesArrayMatch) {
            const existingRoutes = routesArrayMatch[1].trim();
            let fileContents: any;

            if (paradigm === "oop") {
              fileContents = fileContent.replace(
                existingRoutes,
                `${
                  existingRoutes.length > 0 ? existingRoutes + ", " : ""
                }${newRouterInstance}`
              );
            } else {
              fileContents = fileContent.replace(
                `[${existingRoutes}]`,
                `[${
                  existingRoutes.length > 0 ? existingRoutes + ", " : ""
                }${newRoutesInstance}]`
              );
            }

            const updatedContents = `${importStatement}\n${fileContents}`;

            writeFileSync(indexPath, updatedContents);
          }
        } else {
          const routesArrayMatch = fileContent.match(
            /const routes = \[([\s\S]+?)\];/
          );
          if (routesArrayMatch) {
            const existingRoutes = routesArrayMatch[1].trim();

            let fileContents: any;

            if (paradigm === "oop") {
              fileContents = fileContent.replace(
                existingRoutes,
                `${
                  existingRoutes.length > 0 ? existingRoutes + ", " : ""
                }${newRouterInstance}`
              );
            } else {
              fileContents = fileContent.replace(
                `[${existingRoutes}]`,
                `[${
                  existingRoutes.length > 0 ? existingRoutes + ", " : ""
                }${newRoutesInstance}]`
              );
            }

            const updatedContents = `${importStatement}\n${fileContents}`;
            writeFileSync(indexPath, updatedContents);
          }
        }
      } else {
        // if there is no routes array, add new one
        if (extension === "ts") {
          const updatedContents = `${fileContent.trim()}\n\nexport const routes = [${
            paradigm !== "oop" ? newRouterInstance : newRoutesInstance
          }];\n`;

          writeFileSync(indexPath, updatedContents);
        } else {
          const updatedContents = `${fileContent.trim()}\n\nconst routes = [${
            paradigm !== "oop" ? newRouterInstance : newRoutesInstance
          }];\n\n module.exports = { routes } \n`;

          writeFileSync(indexPath, updatedContents);
        }
      }
    }
    console.log(
      chalk.bold(
        chalk.green(
          `added ${
            paradigm === "oop"
              ? `${capitalizedString}Router`
              : `${routesName}Routes`
          } to routes array in index.${extension} file`
        )
      )
    );
  } catch (e: any) {
    console.log(chalk.bold(chalk.red(e)));
  }
};

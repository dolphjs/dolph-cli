import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { dolphMsg } from "../helpers/messages.js";
import path from "path";

const createComponentDirectory = () => {
  const projectRoot = path.join(process.cwd());
  const userComponentPath = path.join(projectRoot, `/src/components`);

  if (!existsSync(userComponentPath)) {
    mkdirSync(userComponentPath);
  }
};

const findSrcDirectory = () => {
  const rootDir = process.cwd();
  const possibleDirs = [`src`];

  const srcDir = possibleDirs.find((dir) =>
    existsSync(path.join(rootDir, dir))
  );

  return srcDir ? path.join(rootDir, srcDir) : null;
};

export const addComponentToServerFile = (componentName: string) => {
  if (!componentName) {
    dolphMsg.errorRed("component extension or name is required! 🤨");
  }

  const serverDir = findSrcDirectory();

  if (!serverDir) {
    dolphMsg.errorRed(
      "something went wrong, please make sure to use the `new` command when creating a dolph project."
    );
    return;
  }

  const serverPath = path.join(serverDir, "server.ts");

  const capitalizedString =
    componentName.charAt(0).toUpperCase() + componentName.slice(1);

  const importStatement = `import { ${capitalizedString}Component } from "./components/${componentName}/${componentName}.component";`;

  try {
    if (!existsSync(serverPath)) {
      const fileContent = `import { DolphFactory } from "@dolphjs/dolph";
${importStatement}
const dolph = new DolphFactory([${capitalizedString}Component]);
dolph.start();
`;
      writeFileSync(serverPath, fileContent);
    } else {
      const fileContent = readFileSync(serverPath, "utf8");

      const newComponentInstance = `${capitalizedString}Component`;

      if (!fileContent.includes(importStatement)) {
        const updatedContent = `${importStatement}\n${fileContent}`;
        writeFileSync(serverPath, updatedContent);
      }

      if (fileContent.includes(`const dolph`)) {
        // add new controller class to the existing array
        const routesArrayMatch = fileContent.match(
          /const dolph = new DolphFactory\(([^)]+)\);/
        );

        if (routesArrayMatch) {
          const existingCode = routesArrayMatch[1].trim();

          let fileContents: any;

          fileContents = fileContent.replace(
            existingCode,
            `${
              existingCode.length > 0
                ? existingCode.slice(0, -1) + `, ${newComponentInstance}]`
                : newComponentInstance
            }`
          );

          const updatedContents = `${importStatement}\n${fileContents}`;

          writeFileSync(serverPath, updatedContents);
        }
      }
    }
    dolphMsg.info(
      `added ${capitalizedString}Component to components array in server.ts file.`
    );
    process.exit(0);
  } catch (e: any) {
    dolphMsg.errorRed(e.toString());
  }
};

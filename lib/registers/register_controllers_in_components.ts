import { existsSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import { dolphMsg } from "../helpers/messages.js";

const findComponentsDirectory = (componentName: string) => {
  const rootDir = process.cwd();
  const possibleDirs = [`src/components/${componentName}`];

  const srcDir = possibleDirs.find((dir) =>
    existsSync(path.join(rootDir, dir))
  );

  return srcDir ? path.join(rootDir, srcDir) : null;
};

export const addControllerInComponentFIle = async (componentName: string) => {
  if (!componentName) {
    dolphMsg.errorRed("component extension or name is required! 🤨");
  }

  const componentDir = findComponentsDirectory(componentName);

  if (!componentDir) {
    dolphMsg.errorRed(
      "something went wrong, please make sure to use the `new` command when creating a dolph project."
    );
    return;
  }

  const componentPath = path.join(
    componentDir,
    `${componentName}.component.ts`
  );

  const capitalizedString =
    componentName.charAt(0).toUpperCase() + componentName.slice(1);

  const importStatement = `import { ${capitalizedString}Controller } from "./${componentName}.controller";`;

  try {
    if (!existsSync(componentPath)) {
      const fileContent = `import { Component } from "@dolphjs/dolph/decorators";
import { ${capitalizedString}Controller } from "./${componentName}.controller";

@Component({ controllers: [${capitalizedString}Controller], services: [] })
export class ${capitalizedString}Component {}
`;
      writeFileSync(componentPath, fileContent);
    } else {
      const fileContent = readFileSync(componentPath, "utf8");

      const newComponentInstance = `${capitalizedString}Controller`;

      if (!fileContent.includes(importStatement)) {
        // If import statement is not present, add it along with the new controller
        const updatedContents = `${importStatement}\n${fileContent.replace(
          /@Component\(\s*{\s*controllers:\s*\[([^\]]*)\]\s*}\s*\)/,
          `@Component({ controllers: [${newComponentInstance}] })`
        )}`;

        writeFileSync(componentPath, updatedContents);
      } else if (fileContent.includes(`const dolph`)) {
        // If import statement is present and contains `const dolph`
        const controllersArrayMatch = fileContent.match(
          /@Component\(\s*{\s*controllers:\s*\[([^\]]*)\]\s*}\s*\)/
        );

        if (controllersArrayMatch) {
          const existingCode = controllersArrayMatch[1].trim();

          let fileContents: any;

          fileContents = fileContent.replace(
            existingCode,
            `${
              existingCode.length > 0
                ? existingCode.slice(0, -1) + `, ${newComponentInstance}`
                : newComponentInstance
            }`
          );

          const updatedContents = `${importStatement}\n${fileContents}`;

          writeFileSync(componentPath, updatedContents);
        }
      }
    }
    dolphMsg.info(
      `registered ${capitalizedString}Controller in ${capitalizedString}Component`
    );
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

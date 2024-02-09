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

export const addControllerInComponentFIle = (componentName: string) => {
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
@Component({ controllers: [${capitalizedString}Controller] })
export class ${capitalizedString}Component {}
`;
      writeFileSync(componentPath, fileContent);
    } else {
      const fileContent = readFileSync(componentPath, "utf8");

      const newComponentInstance = `${capitalizedString}Controller`;

      if (!fileContent.includes(importStatement)) {
        const updatedContent = `${importStatement}\n\n${fileContent}`;
        writeFileSync(componentPath, updatedContent);
      }

      if (fileContent.includes(`const dolph`)) {
        // add new controller class to the existing array
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
      `registerd ${capitalizedString}Controller in ${capitalizedString}Component`
    );
    process.exit(0);
  } catch (e: any) {
    dolphMsg.errorRed(e.toString());
  }
};

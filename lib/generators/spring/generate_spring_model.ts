import { existsSync, mkdirSync, writeFile } from "fs";
import path from "path";
import chalk from "chalk";
import { generateSpringModel } from "../../generators/templates/spring_model_template.js";
import { dolphMsg } from "../../helpers/messages.js";
import { promisify } from "util";

const writeFileAsync = promisify(writeFile);

const createModelDirectory = (componentName: string) => {
  const projectRoot = path.join(process.cwd());
  const userModelPath = path.join(
    projectRoot,
    `/src/components/${componentName}`
  );

  if (!existsSync(userModelPath)) {
    mkdirSync(userModelPath);
  }
};

const findModelDirectory = (componentName: string) => {
  const rootDir = process.cwd();
  const possibleDirs = [`src/components/${componentName}`];

  const modelDir = possibleDirs.find((dir) =>
    existsSync(path.join(rootDir, dir))
  );

  return modelDir ? path.join(rootDir, modelDir) : null;
};

export const generateSpringModelFile = async (
  componentName: string,
  modelDir: string,
  isMongo: boolean,
  isMySql: boolean
) => {
  try {
    await writeFileAsync(
      modelDir,
      generateSpringModel(componentName, isMongo, isMySql)
    );
  } catch (error) {
    dolphMsg.errorRed(error.toString());
  }
};

export const generateModel = async (
  name: string,
  isMongo: boolean,
  isMySql: boolean
) => {
  if (!name) {
    dolphMsg.errorRed("Model extension or name is required! 🤨");
    return;
  }

  let modelDir = findModelDirectory(name);

  if (!modelDir) {
    createModelDirectory(name);
    modelDir = findModelDirectory(name);
  }

  const modelFilePath = path.join(modelDir + `/${name}.model.ts`);

  try {
    await generateSpringModelFile(
      name,
      path.join(modelFilePath),
      isMongo,
      isMySql
    );
    dolphMsg.info(
      `${chalk.blue(
        `${name}.model.ts`
      )} generated successfully for ${chalk.blue(`${name}`)} component.`
    );
  } catch (e: any) {
    dolphMsg.errorRed(e);
  }
};

import { existsSync, mkdirSync, writeFile } from "fs";
import path from "path";
import { promisify } from "util";
import { dolphMsg } from "../../helpers/messages.js";
import { generateSocketService } from "../templates/socket_service_template.js";
import chalk from "chalk";

const writeFileAsync = promisify(writeFile);

const createServiceDirectory = (componentName: string) => {
  const projectRoot = path.join(process.cwd());
  const userServicePath = path.join(projectRoot, `src/shared/${componentName}`);

  if (!existsSync(userServicePath)) {
    mkdirSync(userServicePath);
  }
};

const findServiceDirectory = (componentName: string) => {
  const rootDir = process.cwd();
  const possibleDirs = [`src/shared/${componentName}`];

  const serviceDir = possibleDirs.find((dir) =>
    existsSync(path.join(rootDir, dir))
  );

  return serviceDir ? path.join(rootDir, serviceDir) : null;
};

export const generateSocketServiceFIle = async (
  componentName: string,
  serviceDir: string
) => {
  try {
    await writeFileAsync(serviceDir, generateSocketService(componentName));
  } catch (error: any) {
    dolphMsg.errorRed(error.message.toString());
  }
};

export const generateSocket = async (name: string) => {
  if (!name) {
    name = "";
  }

  let serviceDir = findServiceDirectory("socket");

  if (!serviceDir) {
    createServiceDirectory("socket");
    serviceDir = findServiceDirectory("socket");
  }

  const serviceFilePath = path.join(
    serviceDir + `/${name.length ? name : "events"}.socket.service.ts`
  );

  try {
    await generateSocketServiceFIle(name, path.join(serviceFilePath));

    dolphMsg.info(
      `${chalk.blue(`${name}.socket.service.ts`)} generated successfully.`
    );
  } catch (e: any) {
    dolphMsg.errorRed(e);
  }
};

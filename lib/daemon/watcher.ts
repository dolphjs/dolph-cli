import { spawn } from "child_process";
import { WatchEventType, watch } from "fs";
import chalk from "chalk";
import { getRootDirectory } from "../utils/get_root_dir_path.js";
import { readConfig } from "../utils/read_user_config_path.js";
import { join } from "path";

let fileExtension = "";
let runtimeEngine = "ts-node";

let indexFilePath = "";

export const startApp = () => {
  fileExtension = readConfig().language;
  if (fileExtension === "js") runtimeEngine = "node";
  indexFilePath = join(getRootDirectory(), `index.${fileExtension}`);

  const child = spawn(runtimeEngine, [indexFilePath], { stdio: "inherit" });

  child.on("close", (code: number) => {
    if (code === 1) {
      console.log(
        chalk.bold(
          `${chalk.red("[DOLPH ERROR]: ")} ${chalk.redBright(
            "exiting watch mode ..."
          )}`
        )
      );
      process.exit(1);
    }
  });
};

export const watchFile = () => {
  console.log(
    chalk.bold(
      `${chalk.green("[DOLPH INFO]: ")} ${chalk.greenBright(
        "watching files for changes ..."
      )}`
    )
  );

  fileExtension = readConfig().language;
  if (fileExtension === "js") runtimeEngine = "node";

  watch(
    indexFilePath,
    { recursive: true },
    (_event: WatchEventType, filenamae: string) => {
      if (filenamae && filenamae.endsWith(`.${fileExtension}`)) {
        console.log(
          chalk.bold(
            `${chalk.green("[DOLPH INFO]: ")} ${chalk.greenBright(
              "file changed" + `[${filenamae}]`
            )}`
          )
        );
        startApp();
      }
    }
  );
};

// startApp();
// watchFile();

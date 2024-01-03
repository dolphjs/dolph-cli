import { spawn } from "cross-spawn";
import * as chokidar from "chokidar";
import chalk from "chalk";
import { getRootDirectory } from "../utils/get_root_dir_path.js";
import { readConfig } from "../utils/read_user_config_path.js";
import { join } from "path";

let fileExtension = "";

let indexFilePath = "";

export const startApp = () => {
  console.log(
    chalk.bold(
      `${chalk.yellow("[DOLPH INFO]: ")} ${chalk.yellowBright(
        "starting dolph server ..."
      )}`
    )
  );

  fileExtension = readConfig().language;
  indexFilePath = join(getRootDirectory(), "src", `server.${fileExtension}`);

  const additionalOptions = [
    "-r",
    "tsconfig-paths/register",
    "--transpile-only",
  ];
  const spawnArgs = [...additionalOptions, indexFilePath];

  console.log(
    chalk.bold(
      `${chalk.green("[DOLPH INFO]: ")} ${chalk.greenBright(
        "starting dolph server ..."
      )}`
    )
  );

  const child = spawn(fileExtension === "ts" ? "ts-node" : "node", spawnArgs, {
    stdio: "inherit",
  });

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

export const startProdApp = () => {
  fileExtension = readConfig().language;

  if (fileExtension === "ts") {
    console.log(
      chalk.bold(
        `${chalk.yellow("[DOLPH INFO]: ")} ${chalk.yellowBright(
          "compiling to javascript ..."
        )}`
      )
    );
  }

  indexFilePath = join(getRootDirectory(), "src", `server.${fileExtension}`);
  const spawnArgs = ["src", "-d", "app", "--source-maps", "--copy-files"];

  const child = spawn("swc", spawnArgs, {
    stdio: "inherit",
  });

  console.log(
    chalk.bold(
      `${chalk.green("[DOLPH INFO]: ")} ${chalk.greenBright(
        "starting dolph server ..."
      )}`
    )
  );

  child.on("close", (code: number) => {
    if (code === 1) {
      console.log(
        chalk.bold(
          `${chalk.red("[DOLPH ERROR]: ")} ${chalk.redBright(
            "exiting compilation ..."
          )}`
        )
      );
      process.exit(1);
    }
  });

  indexFilePath = join(getRootDirectory(), "app", `server.${fileExtension}`);

  const child2 = spawn("node", indexFilePath, {
    stdio: "inherit",
  });

  child2.on("close", (code: number) => {
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
  const watcher = chokidar.watch(indexFilePath, {
    ignored: "/node_modules",
    persistent: true,
    ignoreInitial: false,
  });

  watcher.on("all", (_event, path) => {
    chalk.bold(
      `${chalk.green("[DOLPH INFO]: ")} ${chalk.greenBright(
        "file changed" + `[${path}]`
      )}`
    );
    startApp();
  });

  process.on("SIGINT", () => {
    watcher.close();
    process.exit(0);
  });
};

// startApp();
// watchFile();

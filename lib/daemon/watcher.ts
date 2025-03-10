import { spawn } from "cross-spawn";
import * as chokidar from "chokidar";
import chalk from "chalk";
import { getRootDirectory } from "../utils/get_root_dir_path.js";
import { readConfig } from "../utils/read_user_config_path.js";
import { join } from "path";
import _ from "lodash";
import { exec } from "child_process";

let fileExtension = "";
let indexFilePath = "";
let child: any = null;

const killProcess = (processToKill: any) => {
  if (processToKill) {
    console.log(
      `${chalk.bold(chalk.yellow("[DOLPH INFO]: "))} ${chalk.yellowBright(
        "Stopping previous Dolph server..."
      )}`
    );

    // Windows: Use taskkill
    if (process.platform === "win32") {
      exec(`taskkill /PID ${processToKill.pid} /F /T`, (err) => {
        if (err) {
          console.error(
            `${chalk.bold(chalk.red("[DOLPH ERROR]: "))} ${chalk.redBright(
              `Failed to kill process: ${err}`
            )}`
          );
        }
      });
    } else {
      // Linux/macOS: Kill process normally
      processToKill.kill("SIGTERM");
      setTimeout(() => {
        processToKill.kill("SIGKILL");
      }, 1000);
    }
  }
};

export const startApp = (useBun = false) => {
  console.log(
    `${chalk.bold(chalk.yellow("[DOLPH INFO]: "))} ${chalk.yellowBright(
      "Starting Dolph server..."
    )}`
  );

  fileExtension = readConfig().language;
  indexFilePath = join(getRootDirectory(), "src", `server.${fileExtension}`);

  // Kill previous process before starting a new one
  if (child) {
    killProcess(child);
  }

  let spawnArgs = [
    "-r",
    "tsconfig-paths/register",
    "--transpile-only",
    indexFilePath,
  ];
  if (fileExtension === "js") {
    spawnArgs = [indexFilePath];
  }

  if (useBun) {
    console.log(
      `${chalk.bold(chalk.green("[DOLPH INFO:] "))} ${chalk.greenBright(
        "Using Bun to start the server..."
      )}`
    );

    child = spawn("bun", [indexFilePath], { stdio: "inherit" });
  } else {
    child = spawn(fileExtension === "ts" ? "ts-node" : "node", spawnArgs, {
      stdio: "inherit",
    });
  }

  child.on("error", (err) => {
    console.error(
      `${chalk.bold(chalk.red("[DOLPH ERROR]: "))} ${chalk.redBright(`${err}`)}`
    );
    process.exit(1);
  });

  child.on("close", (code: number) => {
    if (code === 1) {
      console.error(
        `${chalk.bold(chalk.red("[DOLPH ERROR]: "))} ${chalk.redBright(
          "Exiting watch mode..."
        )}`
      );
      child = null;
      process.exit(1);
    }
  });
};

export const buildApp = () => {
  return new Promise<void>((resolve, reject) => {
    fileExtension = readConfig().language;

    if (fileExtension === "ts") {
      console.log(
        `${chalk.bold(chalk.yellow("[DOLPH INFO]: "))} ${chalk.yellowBright(
          "compiling to javascript ..."
        )}`
      );

      indexFilePath = join(getRootDirectory(), "src", "server.ts");
      const spawnArgs = ["src", "-d", "app", "--source-maps", "--copy-files"];

      const child = spawn("swc", spawnArgs, {
        stdio: "inherit",
      });

      child.on("error", (err) => {
        `${chalk.bold(chalk.red("[DOLPH ERROR]: "))} ${chalk.redBright(
          `${err}`
        )}`;
        // process.exit(1);
        reject(err);
      });

      child.on("close", (code: number) => {
        if (code === 1) {
          console.log(
            `${chalk.bold(chalk.red("[DOLPH ERROR]: "))} ${chalk.redBright(
              "exiting compilation ..."
            )}`
          );
          reject(new Error("Compilation failed ..."));
        } else {
          console.log(
            `${chalk.bold(chalk.green("[DOLPH INFO]: "))} ${chalk.greenBright(
              "compilation successful"
            )}`
          );
          resolve();
        }
      });
    } else {
      console.log(
        `${chalk.bold(chalk.red("[DOLPH ERROR]: "))} ${chalk.redBright(
          "cannot compile javascript file, exiting compilation ..."
        )}`
      );
      reject(new Error("Cannot compile JavaScript file"));
    }
  });
};

export const startProdApp = async (useBun = false) => {
  try {
    fileExtension = readConfig().language;

    if (child) {
      killProcess(child);
    }

    if (fileExtension === "ts") {
      console.log(
        `${chalk.bold(chalk.yellow("[DOLPH INFO]: "))} ${chalk.yellowBright(
          "Compiling to JavaScript..."
        )}`
      );

      indexFilePath = join(getRootDirectory(), "src", `server.ts`);
      const spawnArgs = ["src", "-d", "app", "--source-maps", "--copy-files"];
      child = spawn("swc", spawnArgs, { stdio: "inherit" });

      await new Promise<void>((resolve, reject) => {
        child.on("close", (code: number) => {
          if (code === 0) {
            resolve();
          } else {
            reject(new Error("Compilation failed"));
          }
        });
      });
    }

    indexFilePath =
      fileExtension === "ts"
        ? join(getRootDirectory(), "app", "src", "server.js")
        : join(getRootDirectory(), "src", "server.js");

    console.log(
      `${chalk.bold(chalk.green("[DOLPH INFO]: "))} ${chalk.greenBright(
        "Starting Dolph server..."
      )}`
    );

    child = useBun
      ? spawn("bun", [indexFilePath], { stdio: "inherit" })
      : spawn("node", [indexFilePath], { stdio: "inherit" });

    child.on("error", (err) => {
      console.error(
        `${chalk.bold(chalk.red("[DOLPH ERROR]: "))} ${chalk.redBright(
          `${err}`
        )}`
      );
      process.exit(1);
    });

    child.on("close", (code: number) => {
      if (code === 1) {
        console.error(
          `${chalk.bold(chalk.red("[DOLPH ERROR]: "))} ${chalk.redBright(
            "Exiting production mode..."
          )}`
        );
        process.exit(1);
      }
    });
  } catch (e: any) {
    console.error(e);
    process.exit(1);
  }
};

const watcher = chokidar.watch([], {
  ignored: "/node_modules",
  persistent: true,
  ignoreInitial: false,
});

let isWatcherActive = false;

const debouncedStartApp = _.debounce((useBun) => startApp(useBun), 1000);

export const watchFile = (useBun = false) => {
  if (!isWatcherActive) {
    console.log(
      `${chalk.bold(chalk.green("[DOLPH INFO]: "))} ${chalk.greenBright(
        "Watching files for changes..."
      )}`
    );

    isWatcherActive = true;
    fileExtension = readConfig().language;
    const srcDirectory = join(getRootDirectory(), "src");
    watcher.add(srcDirectory);

    watcher.on("all", (_event, path) => {
      console.log(
        `${chalk.bold(chalk.green("[DOLPH INFO]: "))} ${chalk.greenBright(
          `File changed: [${path}]`
        )}`
      );

      if (path.endsWith(".ts") || path.endsWith(".js")) {
        debouncedStartApp(useBun);
      }
    });

    process.on("SIGINT", () => {
      console.log(
        `${chalk.bold(chalk.yellow("[DOLPH INFO]: "))} ${chalk.yellowBright(
          "Shutting down watcher..."
        )}`
      );
      if (child) {
        killProcess(child);
      }
      watcher.close();
      process.exit(0);
    });
  } else {
    console.log(
      `${chalk.bold(chalk.red("[DOLPH ERROR]: "))} ${chalk.redBright(
        "Watcher is already active."
      )}`
    );
  }
};

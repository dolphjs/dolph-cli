import { spawn } from "cross-spawn";
import * as chokidar from "chokidar";
import chalk from "chalk";
import { getRootDirectory } from "../utils/get_root_dir_path.js";
import { readConfig } from "../utils/read_user_config_path.js";
import { join } from "path";
import _ from "lodash";

let fileExtension = "";
let indexFilePath = "";
let child;

export const startApp = (useBun = false) => {
  console.log(
    `${chalk.bold(chalk.yellow("[DOLPH INFO]: "))} ${chalk.yellowBright(
      "starting dolph server ..."
    )}`
  );

  fileExtension = readConfig().language;
  indexFilePath = join(getRootDirectory(), "src", `server.${fileExtension}`);

  const additionalOptions = [
    "-r",
    "tsconfig-paths/register",
    "--transpile-only",
  ];

  let spawnArgs = [...additionalOptions, indexFilePath];

  if (fileExtension === "js") {
    spawnArgs = [indexFilePath];
  }

  if (child) {
    child.on("exit", () => {
      child = null;
    });
    // If child process is already running, gracefully close it before restarting
    // child.kill("SIGTERM");
    child.kill("SIGKILL");
  }

  if (useBun) {
    console.log(
      `${chalk.bold(chalk.green("[DOLPH INFO:] "))} ${chalk.greenBright(
        "using Bun to start the server ..."
      )}`
    );

    child = spawn("bun", [indexFilePath], {
      stdio: "inherit",
    });
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
          "exiting watch mode ..."
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

    if (fileExtension === "ts") {
      console.log(
        `${chalk.bold(chalk.yellow("[DOLPH INFO]: "))} ${chalk.yellowBright(
          "compiling to javascript ..."
        )}`
      );

      indexFilePath = join(getRootDirectory(), "src", `server.ts`);
      const spawnArgs = ["src", "-d", "app", "--source-maps", "--copy-files"];

      if (child) {
        child.on("exit", () => {
          child = null;
        });
        child.kill("SIGTERM");
      }

      child = spawn("swc", spawnArgs, {
        stdio: "inherit",
      });

      child.on("error", (err) => {
        `${chalk.bold(chalk.red("[DOLPH ERROR]: "))} ${chalk.redBright(
          `${err}`
        )}`;
        process.exit(1);
      });

      child.on("close", (code: number) => {
        if (code === 1) {
          console.log(
            `${chalk.bold(chalk.red("[DOLPH ERROR]: "))} ${chalk.redBright(
              "exiting compilation ..."
            )}`
          );
          process.exit(1);
        }
      });

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
        "starting dolph server ..."
      )}`
    );

    if (useBun) {
      console.log(
        `${chalk.bold(chalk.green("[DOLPH INFO]: "))} ${chalk.greenBright(
          "using Bun to start the server ..."
        )}`
      );

      const child2 = spawn("bun", [indexFilePath], {
        stdio: "inherit",
      });

      child2.on("error", (err) => {
        `${chalk.bold(chalk.red("[DOLPH ERROR]: "))} ${chalk.redBright(
          `${err}`
        )}`;
        process.exit(1);
      });

      child2.on("close", (code: number) => {
        if (code === 1) {
          `${chalk.bold(chalk.red("[DOLPH ERROR]: "))} ${chalk.redBright(
            "exiting watch mode ..."
          )}`;

          process.exit(1);
        }
      });
    } else {
      const child2 = spawn("node", [indexFilePath], {
        stdio: "inherit",
      });

      child2.on("error", (err) => {
        `${chalk.bold(chalk.red("[DOLPH ERROR]: "))} ${chalk.redBright(
          `${err}`
        )}`;
        process.exit(1);
      });

      child2.on("close", (code: number) => {
        if (code === 1) {
          `${chalk.bold(chalk.red("[DOLPH ERROR]: "))} ${chalk.redBright(
            "exiting watch mode ..."
          )}`;

          process.exit(1);
        }
      });
    }
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
        "watching files for changes ..."
      )}`
    );

    isWatcherActive = true;

    fileExtension = readConfig().language;

    const srcDirectory = join(getRootDirectory(), "src");

    watcher.add(srcDirectory);

    watcher.on("all", (_event, path) => {
      `${chalk.bold(chalk.green("[DOLPH INFO]: "))} ${chalk.greenBright(
        "file changed" + `[${path}]`
      )}`;

      if (
        path.endsWith(".ts") ||
        path.endsWith(".js")
        // path.startsWith("dolph_config")
      ) {
        debouncedStartApp(useBun);
      }
    });

    process.on("SIGINT", () => {
      watcher.close();
      process.exit(0);
    });
  } else {
    console.log(
      `${chalk.bold(chalk.red("[DOLPH ERROR]: "))} ${chalk.redBright(
        "watcher is already active."
      )}`
    );
  }
};

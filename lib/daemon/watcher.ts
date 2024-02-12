import { spawn } from "cross-spawn";
import * as chokidar from "chokidar";
import chalk from "chalk";
import { getRootDirectory } from "../utils/get_root_dir_path.js";
import { readConfig } from "../utils/read_user_config_path.js";
import { join } from "path";
import _ from "lodash";

let fileExtension = "";

let indexFilePath = "";

export const startApp = () => {
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

  console.log(
    `${chalk.bold(chalk.green("[DOLPH INFO]: "))} ${chalk.greenBright(
      "starting dolph server ..."
    )}`
  );

  const child = spawn(fileExtension === "ts" ? "ts-node" : "node", spawnArgs, {
    stdio: "inherit",
  });

  child.on("error", (err) => {
    `${chalk.bold(chalk.red("[DOLPH ERROR]: "))} ${chalk.redBright(`${err}`)}`;
    process.exit(1);
  });

  child.on("close", (code: number) => {
    if (code === 1) {
      `${chalk.bold(chalk.red("[DOLPH ERROR]: "))} ${chalk.redBright(
        "exiting watch mode ..."
      )}`;
      process.exit(1);
    }
  });
};

export const buildApp = () => {
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

    console.log(
      `${chalk.bold(chalk.green("[DOLPH INFO]: "))} ${chalk.greenBright(
        "compilation successful"
      )}`
    );

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
  } else {
    console.log(
      `${chalk.bold(chalk.red("[DOLPH ERROR]: "))} ${chalk.redBright(
        "cannot compile javascript file, exiting compilation ..."
      )}`
    );
  }
};

export const startProdApp = () => {
  fileExtension = readConfig().language;

  if (fileExtension === "ts") {
    console.log(
      `${chalk.bold(chalk.yellow("[DOLPH INFO]: "))} ${chalk.yellowBright(
        "compiling to javascript ..."
      )}`
    );

    indexFilePath = join(getRootDirectory(), "src", `server.ts`);
    const spawnArgs = ["src", "-d", "app", "--source-maps", "--copy-files"];

    const child = spawn("swc", spawnArgs, {
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
  }

  indexFilePath = join(getRootDirectory(), "app", "src", `server.js`);

  if (fileExtension === "js") {
    indexFilePath = join(getRootDirectory(), "src", `server.js`);
  }

  console.log(
    `${chalk.bold(chalk.green("[DOLPH INFO]: "))} ${chalk.greenBright(
      "starting dolph server ..."
    )}`
  );

  const child2 = spawn("node", [indexFilePath], {
    stdio: "inherit",
  });

  child2.on("error", (err) => {
    `${chalk.bold(chalk.red("[DOLPH ERROR]: "))} ${chalk.redBright(`${err}`)}`;
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
};

const watcher = chokidar.watch([], {
  ignored: "/node_modules",
  persistent: true,
  ignoreInitial: false,
});

let isWatcherActive = false;

const debouncedStartApp = _.debounce(startApp, 1000);

export const watchFile = () => {
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

      if (path.endsWith(".ts") || path.endsWith(".js")) {
        debouncedStartApp();
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

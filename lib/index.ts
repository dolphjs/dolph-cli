#!/usr/bin/env node

// import chalk from "chalk";
// import { program } from "commander";
// import figlet from "figlet";
// import { packageDescription } from "./utils/package_description.js";
// import { configurePackage } from "./utils/read_user_config.js";
// import { InitDolphCli } from "./utils/package_init.js";
// import { packageGenerator } from "./utils/package_generator.js";
// import { watcherConfig } from "./daemon/watcherConfig.js";

// figlet.text(
//   "dolph cli",
//   {
//     font: "Big",
//     horizontalLayout: "default",
//     verticalLayout: "default",
//     width: 150,
//     whitespaceBreak: true,
//   },
//   function (err: any, _data: any) {
//     if (err) {
//       console.log("[FIGLET ERROR]: ", chalk.red(err.toString()));
//       return;
//     }

//     // console.log(chalk.bold(chalk.cyan(data)));
//     InitDolphCli();
//     packageDescription();
//     configurePackage();
//     packageGenerator();
//     watcherConfig();

//     program.command("*", { hidden: true }).action(() => {
//       console.log(
//         `${chalk.red("[DOLPH ERROR]: ")} ${chalk.redBright(
//           "unknown command. See list of available commands: "
//         )}`
//       );
//       program.help();
//     });

//     program.parse(process.argv);
//   }
// );

import * as path from "path";
import * as os from "os";
import { spawn } from "child_process";
import chalk from "chalk";

function getBinaryPath() {
  const platform = os.platform();
  const arch = os.arch();

  let binaryName = "dolph";
  if (platform === "win32") {
    binaryName = "dolph.exe";
  }

  // const binaryPath = path.join(__dirname, "..", "bin", binaryName);
  const binaryPath = path.join(__dirname, "../", "bin", binaryName);

  if (!require("fs").existsSync(binaryPath)) {
    console.log(
      `${chalk.red("[ERROR]: ")} ${chalk.blue(
        `DolphJS CLI binary not found. Please run "npm install" again.`
      )}`
    );

    process.exit(1);
  }
  return binaryPath;
}

const binary = getBinaryPath();
// Pass all arguments to the Rust binary
const args = process.argv.slice(2);

const child = spawn(binary, args, {
  // This pipes input/output to the current terminal
  stdio: "inherit",
});

child.on("error", (err) => {
  console.log(
    `${chalk.red("[ERROR]: ")} ${chalk.blue(
      `Failed to start DolphJS CLI: ${err.message}`
    )}`
  );
  process.exit(1);
});

child.on("close", (code) => {
  if (code !== null) {
    process.exit(code);
  }
});

#!/usr/bin/env node

import chalk from "chalk";
import { program } from "commander";
import figlet from "figlet";
import { packageDescription } from "./utils/package_description.js";
import { configurePackage } from "./utils/read_user_config.js";
import { InitDolphCli } from "./utils/package_init.js";
import { packageGenerator } from "./utils/package_generator.js";

figlet.text(
  "dolphjs cli",
  {
    font: "Big",
    horizontalLayout: "default",
    verticalLayout: "default",
    width: 150,
    whitespaceBreak: true,
  },
  function (err: any, _data: any) {
    if (err) {
      console.log("[FIGLET ERROR]: ", chalk.red(err.toString()));
      return;
    }

    // console.log(chalk.bold(chalk.cyan(data)));
    InitDolphCli();
    packageDescription();
    configurePackage();
    packageGenerator();

    program.command("*", { hidden: true }).action(() => {
      console.log(
        `${chalk.red("[DOLPH ERROR]: ")} ${chalk.redBright(
          "unknown command. See list of available commands: "
        )}`
      );
      program.help();
    });

    program.parse(process.argv);
  }
);

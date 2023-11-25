#!/usr/bin/env node

import colors from "colors";
import { program } from "commander";
import figlet from "figlet";
import { packageDescription } from "./utils/package_description.js";
import { configurePackage } from "./utils/read_user_config.js";
import { InitDolphCli } from "./utils/package_init.js";
import { packageGenerator } from "./utils/package_generator.js";
import { dolphTail } from "utils/commands/dolph_tail.js";

figlet.text(
  "dolphjs cli",
  {
    font: "Big",
    horizontalLayout: "default",
    verticalLayout: "default",
    width: 150,
    whitespaceBreak: true,
  },
  function (err: any, data: any) {
    if (err) {
      console.log("Figlet error:", colors.red(err.toString()));
      return;
    }

    console.log(colors.bold(colors.rainbow(data)));
    InitDolphCli();
    packageDescription();
    configurePackage();
    packageGenerator();
    dolphTail('');//aded a qoute to server as file path
    program.parse(process.argv);
  }
);
//TODO: add a command to start the server
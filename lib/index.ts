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
  "DolphJs cli",
  {
    horizontalLayout: "default",
    verticalLayout: "default",
    width: 50,
    whitespaceBreak: false,
  },
  function (err: any, data: any) {
    if (err) {
      console.log("Figlet error:", colors.red(err.toString()));
      return;
    }

    console.log(colors.bold(colors.green(data)));
    InitDolphCli();
    packageDescription();
    configurePackage();
    packageGenerator();
    //dolphTail('');//aded a qoute to server as file path
    program.parse(process.argv);
  }
);
//TODO: add a command to start the server
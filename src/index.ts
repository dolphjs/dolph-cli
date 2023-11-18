#!/usr/bin/env node

import colors from "colors";
import { program } from "commander";
import figlet from "figlet";
import { packageDescription } from "./utils/package_description.js";
import { configurePackage } from "./utils/read_user_config.js";
import { InitDolphCli } from "./utils/package_init.js";
import { packageGenerator } from "./utils/package_generator.js";

figlet.text(
  "Dolphjs CLI",
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

    program.parse(process.argv);
  }
);

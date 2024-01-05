import { existsSync, mkdirSync, writeFileSync } from "fs";
import inquirer from "inquirer";
import path from "path";
import yaml from "js-yaml";
import chalk from "chalk";
import { DefaultConfig } from "../types/config.js";
import { writeSwcrc } from "./write_swrcc.js";
import { writeTsConfigFile } from "./write_tsconfig.js";
import { writeDolphConfig } from "./write_dolph_config.js";
import { writePackageJsonFile } from "./write_package_json.js";
import { writeGitignore } from "./write_gitignore.js";

export const initDolphCli = (appname: string) => {
  let projectName = appname;
  if (appname.length === 0) {
    console.log(
      chalk.red(
        chalk.bold(
          "Provide a name for you project or indicate with a '.' to use current directory "
        )
      )
    );
    return;
  }

  if (appname !== ".") {
    mkdirSync(appname);
    process.chdir(appname);
  } else {
    projectName = process.cwd().split("/").pop();
  }

  const configFolderPath = path.join(process.cwd());
  const srcPath = path.join(configFolderPath, "src");
  const userConfigFilePath = path.join(configFolderPath, "dolph_cli.yaml");

  if (!existsSync(configFolderPath)) {
    mkdirSync(configFolderPath);
  }

  if (!existsSync(srcPath)) {
    mkdirSync(srcPath);
  }

  const defaultConfig: DefaultConfig = {
    language: "ts",
    paradigm: "oop",
    database: "mongo",
    generateFolder: true,
  };

  if (!existsSync(userConfigFilePath)) {
    inquirer
      .prompt([
        {
          type: "list",
          name: "language",
          message: "Select your preferred language",
          choices: ["ts", "js"],
          default: "ts",
        },
        {
          type: "list",
          name: "paradigm",
          message:
            "Choose the programming paradigm for your app (recommended is 'oop' )",
          choices: ["oop", "functional"],
          default: "oop",
        },
        {
          type: "list",
          name: "database",
          message: "Which database will you be using?",
          choices: ["mongo", "mysql", "postgresql", "other"],
          default: "mongo",
        },
        // {
        //   type: "list",
        //   name: "generateFolder",
        //   message:
        //     "Generate folder and files for the Services, Models, Controllers and Routes",
        //   choices: ["true", "false"],
        //   default: "true",
        // },
      ])
      .then((replies) => {
        const userConfig = { ...defaultConfig, ...replies };

        const yamlString = yaml.dump(userConfig);

        writeFileSync(userConfigFilePath, yamlString, "utf8");

        if (userConfig.language === "ts") {
          writeSwcrc();
          writeTsConfigFile();
        }

        writeDolphConfig();
        writePackageJsonFile(projectName, userConfig.language);
        writeGitignore();

        console.log(
          chalk.green(
            chalk.bold(
              "dolph cli configurations have been initialized successfully 😎."
            )
          )
        );

        console.log(
          chalk.green(
            chalk.bold(
              "run yarn install to install dependencies in project directory and start coding 😉."
            )
          )
        );

        process.exit(0);
      });
  } else {
    console.log(
      chalk.bold(
        chalk.cyan(
          "I see you already have your dolph cli configurations present 😉."
        )
      )
    );
  }
};

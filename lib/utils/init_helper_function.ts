import { existsSync, mkdirSync, writeFileSync } from "fs";
import inquirer from "inquirer";
import path from "path";
import yaml from "js-yaml";
import colors from "colors";
import { DefaultConfig } from "../types/config.js";
import { writeSwcrc } from "./write_swrcc.js";
import { writeTsConfigFile } from "./write_tsconfig.js";
import { writeDolphConfig } from "./write_dolph_config.js";
import { writePackageJsonFile } from "./write_package_json.js";
import { writeGitignore } from "./write_gitignore.js";

export const initDolphCli = () => {
  const configFolderPath = path.join(process.cwd());
  const srcPath = path.join(configFolderPath, "src");
  const userConfigFilePath = path.join(configFolderPath, "dolph-cli.yaml");

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
        writePackageJsonFile("server", userConfig.language);
        writeGitignore();

        console.log(
          colors.green(
            colors.bold(
              "dolph cli configurations have been initialized successfully 😎."
            )
          )
        );

        console.log(
          colors.green(
            colors.bold(
              "run yarn install to install dependencies in project directory and start coding 😉."
            )
          )
        );
      });
  } else {
    console.log(
      colors.bold(
        colors.cyan(
          "I see you already have your dolph cli configurations present 😉."
        )
      )
    );
  }
};

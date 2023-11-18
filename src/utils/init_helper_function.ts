import { existsSync, mkdirSync, writeFileSync } from "fs";
import inquirer from "inquirer";
import path from "path";
import yaml from "js-yaml";
import colors from "colors";
import { DefaultConfig } from "../types/config.js";

export const initDolphCli = () => {
  const configFolderPath = path.join(process.cwd(), "dolph-cli");
  const userConfigFilePath = path.join(configFolderPath, "dolph-cli.yaml");

  if (!existsSync(configFolderPath)) {
    mkdirSync(configFolderPath);
  }

  const defaultConfig: DefaultConfig = {
    language: "ts",
    generateFolder: true,
    paradigm: "oop",
    database: "mongo",
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
        {
          type: "list",
          name: "generateFolder",
          message:
            "Generate folder and files for the Services, Models, Controllers and Routes",
          choices: ["true", "false"],
          default: "true",
        },
      ])
      .then((replies) => {
        const userConfig = { ...defaultConfig, ...replies };

        const yamlString = yaml.dump(userConfig);

        writeFileSync(userConfigFilePath, yamlString, "utf8");

        console.log(
          colors.green(
            colors.bold(
              "Dolph CLI configurations have been intialized successfully 😎."
            )
          )
        );
      });
  } else {
    console.log(
      colors.bold(
        colors.cyan(
          "I see you already have your Dolph CLI configurations present 😉."
        )
      )
    );
  }
};

import { existsSync, mkdirSync, writeFileSync } from "fs";
import inquirer from "inquirer";
import path from "path";
import yaml from "js-yaml";
import { DefaultConfig } from "../types/config.js";
import { writeSwcrc } from "./write_swrcc.js";
import { writeTsConfigFile } from "./write_tsconfig.js";
import { writeDolphConfig } from "./write_dolph_config.js";
import { writePackageJsonFile } from "./write_package_json.js";
import { writeGitignore } from "./write_gitignore.js";
import { dolphMsg } from "../helpers/messages.js";
import { addServerFile as addSpringServerFile } from "../registers/server_file_spring.js";
import { addServerFile as addExpressServerFile } from "../registers/server_file_express.js";

export const initDolphCli = (appname: string) => {
  let projectName = appname;
  if (appname.length === 0) {
    dolphMsg.errorGray(
      "provide a name for you project or indicate with a '.' to use current directory."
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
  const testPath = path.join(configFolderPath, "tests");
  const sharedDirPath = path.join(srcPath, "shared");
  const componentDirPath = path.join(srcPath, "components");

  if (!existsSync(configFolderPath)) {
    mkdirSync(configFolderPath);
  }

  if (!existsSync(srcPath)) {
    mkdirSync(srcPath);
  }

  if (!existsSync(testPath)) {
    mkdirSync(testPath);
  }

  const defaultConfig: DefaultConfig = {
    language: "ts",
    paradigm: "oop",
    database: "mongo",
    generateFolder: true,
    routing: "express",
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
          name: "routing",
          message:
            "Which dolph routing architecture would you be using? (choosing 'spring' means that you are making use of  both 'oop' & 'typescript')",
          choices: ["express", "spring"],
          default: "express",
        },
      ])
      .then((replies) => {
        // TODO: add this to the config file:
        const comment =
          "# this is an auto-generated file, please do not edit manually\n";

        if (replies.routing === "spring") {
          replies.paradigm = "oop";
          replies.language = "ts";
        }

        const userConfig = { ...defaultConfig, ...replies };

        const yamlString = comment + yaml.dump(userConfig);

        writeFileSync(userConfigFilePath, yamlString, "utf8");

        if (userConfig.language === "ts") {
          writeSwcrc(userConfig.routing === "spring" ? true : false);
          writeTsConfigFile(userConfig.routing === "spring" ? true : false);
        }

        writeDolphConfig();
        writePackageJsonFile(projectName, userConfig.language);
        writeGitignore();

        if (userConfig.routing === "spring") {
          if (!existsSync(componentDirPath)) {
            mkdirSync(componentDirPath);
          }
          if (!existsSync(sharedDirPath)) {
            mkdirSync(sharedDirPath);
          }
          addSpringServerFile(userConfig.database, "");
        }

        dolphMsg.infoBlue(
          "dolph configurations have been initialized successfully ✨."
        );

        dolphMsg.infoBlue(
          "run `yarn install` to install dependencies in project directory and start building 🚀."
        );

        process.exit(0);
      });
  } else {
    dolphMsg.info(
      "I see you already have your dolph configurations present, so I'll abort gently ... 😉."
    );
  }
};

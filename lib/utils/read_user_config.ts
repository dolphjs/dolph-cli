import { program } from "commander";
import chalk from "chalk";
import { readConfig } from "./read_user_config_path.js";
import { writeConfig } from "./write_user_config.js";
import { dolphMsg } from "../helpers/messages.js";

const dbOptions = ["mongo", "postgresql", "mysql", "other"];

export const configurePackage = () => {
  program
    .command("config")
    .alias("cf")
    .description("Set default configurations")
    .option(
      "-lg, --language" + chalk.bold(chalk.blue("<language>")),
      "Set the default coding language (ts or js)"
    )
    .option(
      "-pd, --paradigm" + chalk.bold(chalk.blue("<paradigm>")),
      "Set the default programming paradigm (oop or functional)"
    )
    .option(
      "-db, --database" + chalk.bold(chalk.blue("<database>")),
      "Set the default project database (mongo, mysql, postresql or other)"
    )
    .option(
      "-gf, --generateFolder" + chalk.bold(chalk.blue("<boolean>")),
      "Generates a folder file for the Services, Models, Controllers and Routes (true or false)"
    )
    .action(async (name: any, options: any) => {
      let config = readConfig();

      Object.entries(name).forEach(([key, value]) => {
        if (key && key.toLocaleLowerCase().includes("language") && value) {
          console.log(value.toString(), value);
          if (value.toString() !== "js" && value.toString() !== "ts") {
            dolphMsg.errorRed(
              `invalid project language, format must be either ${chalk.bold(
                "js"
              )} or ${chalk.bold("ts")}`
            );
            return;
          }
          config.language = value;
          writeConfig(config);
          dolphMsg.info(
            `default project language is now ${chalk.bold(config.language)}`
          );
          return;
        }

        if (key && key.toLocaleLowerCase().includes("paradigm") && value) {
          if (value.toString() !== "oop" && value.toString() !== "functional") {
            dolphMsg.errorRed(
              `invalid programming paradigm, must be either ${chalk.bold(
                "oop"
              )} or ${chalk.bold("functional")}`
            );
            return;
          }

          config.paradigm = value;
          writeConfig(config);
          dolphMsg.info(
            `default programming paradigm is now ${chalk.bold(config.paradigm)}`
          );
          return;
        }

        if (key && key.toLocaleLowerCase().includes("database") && value) {
          if (!dbOptions.includes(value.toString())) {
            dolphMsg.errorRed(
              `invalid database value, must be either of these: ${dbOptions.join(
                ", "
              )} `
            );
            return;
          }

          config.database = value;
          writeConfig(config);
          dolphMsg.info(
            `default project database is now ${chalk.bold(config.database)}`
          );
          return;
        }
      });

      if (Object.keys(options).length === 0) {
        dolphMsg.errorGray(
          `no configurations applied, run ${chalk.green(
            "dolph config --help"
          )} to see available commands`
        );
      }
      process.exit(0);
    });
};

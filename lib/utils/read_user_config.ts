import { program } from "commander";
import chalk from "chalk";
import { readConfig } from "./read_user_config_path.js";
import { writeConfig } from "./write_user_config.js";

const dbOptions = ["mongo", "postgresql", "mysql", "other"];

export const configurePackage = () => {
  program
    .command("config")
    .alias("cf")
    .description("Set default configurations")
    .option(
      "-l, --language" + chalk.bold(chalk.blue("<language>")),
      "Set the default coding language (ts or js)"
    )
    .option(
      "-p, --paradigm" + chalk.bold(chalk.blue("<paradigm>")),
      "Set the default programming paradigm (oop or functional)"
    )
    .option(
      "-d, --database" + chalk.bold(chalk.blue("<database>")),
      "Set the default project database (mongo, mysql, postresql or other)"
    )
    .option(
      "-gf, --generateFolder" + chalk.bold(chalk.blue("<boolean>")),
      "Generates a folder file for the Services, Models, Controllers and Routes (true or false)"
    )
    .action((options) => {
      const config = readConfig();

      // validate language choosen

      if (options.language) {
        if (options.language !== "js" && options.language !== "ts") {
          console.log(options.language);

          console.log(
            chalk.red(
              `Invalid project language, format must be either ${chalk.bold(
                "js"
              )} or ${chalk.bold("ts")}`
            )
          );
          return;
        }
        config.language = options.language;
        writeConfig(config);
        console.log(
          chalk.cyan(
            `Default project language is now ${chalk.bold(config.language)}`
          )
        );
        return;
      }

      // validate paradigm choosen
      if (options.paradigm) {
        if (options.paradigm !== "oop" && options.paradigm !== "functional") {
          console.log(
            chalk.red(
              `Invalid programming paradigm, must be either ${chalk.bold(
                "oop"
              )} or ${chalk.bold("functional")}`
            )
          );
          return;
        }

        config.paradigm = options.paradigm;
        writeConfig(config);
        console.log(
          chalk.cyan(
            `Default programming paradigm is now ${chalk.bold(config.paradigm)}`
          )
        );
        return;
      }

      // validate database choosen
      if (options.database) {
        if (!dbOptions.includes(options.database)) {
          console.log(
            chalk.red(
              `Invalid database value, must be either of these: ${dbOptions.join(
                ", "
              )} `
            )
          );
          return;
        }

        config.database = options.database;
        writeConfig(config);
        console.log(
          chalk.cyan(
            `Default project database is now ${chalk.bold(config.database)}`
          )
        );
        return;
      }

      // validate generateFolder

      if (options.generateFolder) {
        if (
          options.generateFolder !== "true" &&
          options.generateFolder !== "false"
        ) {
          console.log(
            chalk.red(
              `Invalid folder generation value, value must be ${chalk.bold(
                "true"
              )} or ${chalk.bold("false")}`
            )
          );
          return;
        }
        config.generateFolder = options.generateFolder;
        writeConfig(config);
        console.log(
          chalk.cyan(
            `Generation of folder files for the Services, Models, Controllers and Routes  set to ${chalk.bold(
              config.generateFolder
            )}`
          )
        );
        return;
      }

      if (Object.keys(options).length === 0) {
        console.log(
          chalk.yellow(
            chalk.bold(
              `No configurations applied, run ${chalk.white(
                "dolph-cli config --help"
              )} to see available commands`
            )
          )
        );
      }
    });
};

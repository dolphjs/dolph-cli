import { program } from "commander";
import colors from "colors";
import { readConfig } from "./read_user_config_path.js";
import { writeConfig } from "./write_user_config.js";

const dbOptions = ["mongo", "postgresql", "mysql", "other"];

export const configurePackage = () => {
  program
    .command("config")
    .alias("cf")
    .description("Set default configurations")
    .option(
      "-l, --language" + colors.bold(colors.blue("<language>")),
      "Set the default coding language (ts or js)"
    )
    .option(
      "-p, --paradigm" + colors.bold(colors.blue("<paradigm>")),
      "Set the default programming paradigm (oop or functional)"
    )
    .option(
      "-d, --database" + colors.bold(colors.blue("<database>")),
      "Set the default project database (mongo, mysql, postresql or other)"
    )
    .option(
      "-gf, --generateFolder" + colors.bold(colors.blue("<boolean>")),
      "Generates a folder file for the Services, Models, Controllers and Routes (true or false)"
    )
    .action((options) => {
      const config = readConfig();

      // validate language choosen

      if (options.language) {
        if (options.language !== "js" && options.language !== "ts") {
          console.log(options.language);

          console.log(
            colors.red(
              `Invalid project language, format must be either ${colors.bold(
                "js"
              )} or ${colors.bold("ts")}`
            )
          );
          return;
        }
        config.language = options.language;
        writeConfig(config);
        console.log(
          colors.cyan(
            `Default project language is now ${colors.bold(config.language)}`
          )
        );
        return;
      }

      // validate paradigm choosen
      if (options.paradigm) {
        if (options.paradigm !== "oop" && options.paradigm !== "functional") {
          console.log(
            colors.red(
              `Invalid programming paradigm, must be either ${colors.bold(
                "oop"
              )} or ${colors.bold("functional")}`
            )
          );
          return;
        }

        config.paradigm = options.paradigm;
        writeConfig(config);
        console.log(
          colors.cyan(
            `Default programming paradigm is now ${colors.bold(
              config.paradigm
            )}`
          )
        );
        return;
      }

      // validate database choosen
      if (options.database) {
        if (!dbOptions.includes(options.database)) {
          console.log(
            colors.red(
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
          colors.cyan(
            `Default project database is now ${colors.bold(config.database)}`
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
            colors.red(
              `Invalid folder generation value, value must be ${colors.bold(
                "true"
              )} or ${colors.bold("false")}`
            )
          );
          return;
        }
        config.generateFolder = options.generateFolder;
        writeConfig(config);
        console.log(
          colors.cyan(
            `Generation of folder files for the Services, Models, Controllers and Routes  set to ${colors.bold(
              config.generateFolder
            )}`
          )
        );
        return;
      }

      if (Object.keys(options).length === 0) {
        console.log(
          colors.yellow(
            colors.bold(
              `No configurations applied, run ${colors.white(
                "dolph-cli config --help"
              )} to see available commands`
            )
          )
        );
      }
    });
};

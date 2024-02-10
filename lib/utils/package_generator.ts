import { program } from "commander";
import chalk from "chalk";
import * as controllerGen from "../generators/generate_controller.js";
import * as serviceGen from "../generators/generate_service.js";
import * as routesGen from "../generators/generate_routes.js";
import * as modelGen from "../generators/generate_model.js";
import * as mysqlGen from "../generators/generate_mysql.js";
import { readConfig } from "./read_user_config_path.js";
import { addRoutesIndexFile } from "../registers/register_routes.js";
import { addServerFile } from "../registers/server_file_express.js";
import { dolphMsg } from "../helpers/messages.js";
import { generateComponent } from "../generators/spring/generate_spring_component.js";
import { addComponentToServerFile } from "../registers/register_component.js";
import { addControllerInComponentFIle } from "../registers/register_controllers_in_components.js";

export const packageGenerator = () => {
  program
    .command("generate")
    .alias("g")
    .option(
      "-s, --service" + chalk.bold(chalk.blue(" <name>")),
      "Generates a dolphjs service file."
    )
    .option(
      "-c, --controller" + chalk.bold(chalk.blue(" <name>")),
      "Generates a dolphjs controller file."
    )
    .option(
      "-r, --route" + chalk.bold(chalk.blue(" <name>")),
      "Generates a dolphjs routes file."
    )
    .option(
      "-m, --model" + chalk.bold(chalk.blue(" <name>")),
      "Generates a dolphjs models file."
    )
    .option(
      "-com, --component" + chalk.bold(chalk.blue(" <name>")),
      "Generates a dolphjs spring component file."
    )
    .option(
      "-a, --all" + chalk.bold(chalk.blue(" <name> ")),
      "Generates dolphjs controllers, routes, models and services files for the name paramter."
    )

    .action(async (name: any, _options: any) => {
      const promises = Object.entries(name).map(async ([key, value]) => {
        if (key && key.toLowerCase().includes("controller") && value) {
          await controllerGen.generateController(value.toString());
        }

        if (key && key.toLowerCase().includes("service") && value) {
          await serviceGen.generateService(value.toString());
        }

        if (key && key.toLowerCase().includes("route") && value) {
          if (readConfig().routing === "spring") {
            dolphMsg.errorGray("cannot create routes file for spring routing.");
          } else {
            await routesGen.generateRouter(value.toString());
            await addRoutesIndexFile(value.toString(), readConfig);
          }
        }

        if (key && key.toLowerCase().includes("model") && value) {
          await modelGen.generateModel(value.toString());
          if (readConfig().database === "mysql") {
            await mysqlGen.generateConfig(value.toString());
          }
        }

        if (key && key.toLowerCase().includes("component") && value) {
          await generateComponent(value.toString());
        }

        if (key && key.toLowerCase().includes("all") && value) {
          await modelGen.generateModel(value.toString());

          if (readConfig().database === "mysql") {
            await mysqlGen.generateConfig(value.toString());
          }

          await serviceGen.generateService(value.toString());
          await controllerGen.generateController(value.toString());

          if (readConfig().routing === "express") {
            await routesGen.generateRouter(value.toString());
            await addRoutesIndexFile(value.toString(), readConfig);
            await addServerFile(readConfig);
          } else {
            await generateComponent(value.toString());
            await addControllerInComponentFIle(value.toString());
            await addComponentToServerFile(value.toString());
          }
        }
      });

      await Promise.all(promises);
    });
};

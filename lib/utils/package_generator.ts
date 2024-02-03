import { program } from "commander";
import chalk from "chalk";
import * as controllerGen from "../generators/generate_controller.js";
import * as serviceGen from "../generators/generate_service.js";
import * as routesGen from "../generators/generate_routes.js";
import * as modelGen from "../generators/generate_model.js";
import * as mysqlGen from "../generators/generate_mysql.js";
import { readConfig } from "./read_user_config_path.js";
import { addRoutesIndexFile } from "../registers/register_routes.js";
import { addServerFile } from "../registers/server_file_routes.js";
import { dolphMsg } from "../helpers/messages.js";
import { generateComponent } from "../generators/spring/generate_spring_component.js";
import { generateController } from "../generators/spring/generate_spring_controller.js";
import { generateService } from "../generators/spring/generate_spring_service.js";
import { generateModel } from "../generators/spring/generate_spring_model.js";
import { addComponentToServerFile } from "../registers/register_component.js";

export const packageGenerator = () => {
  program
    .command("generate")
    .alias("g")
    .option(
      "-s, --service" + chalk.bold(chalk.blue("<name>")),
      "Generates a dolphjs service file."
    )
    .option(
      "-c, --controller" + chalk.bold(chalk.blue("<name>")),
      "Generates a dolphjs controller file."
    )
    .option(
      "-r, --route" + chalk.bold(chalk.blue("<name>")),
      "Generates a dolphjs routes file."
    )
    .option(
      "-m, --model" + chalk.bold(chalk.blue("<name>")),
      "Generates a dolphjs models file."
    )
    .option(
      "-com, --component" + chalk.bold(chalk.blue("<name>")),
      "Generates a dolphjs spring component file."
    )
    .option(
      "-a, --all" + chalk.bold(chalk.blue(" <name> ")),
      "Generates dolphjs controllers, routes, models and services files for the name paramter."
    )

    .action(async (name: any, _options: any) => {
      Object.entries(name).forEach(([key, value]) => {
        // generates controller files for the paramter name
        if (key && key.toLowerCase().includes("controller") && value) {
          controllerGen.generateController(value.toString());
        }

        // generates service files for the paramter name
        if (key && key.toLowerCase().includes("service") && value) {
          if (readConfig().routing === "express") {
            serviceGen.generateService(value.toString());
          } else {
            generateService(
              value.toString(),
              readConfig().database === "mongo" ? true : false,
              readConfig().database === "mysql" ? true : false
            );
          }
        }

        // generatess routes files for the paramter name
        if (key && key.toLowerCase().includes("route") && value) {
          if (readConfig().routing === "spring") {
            dolphMsg.errorGray("cannot create routes file for spring routing.");
          } else {
            routesGen.generateRouter(value.toString());
            addRoutesIndexFile(value.toString(), readConfig);
          }
        }

        // generatess model fles for the paramter name
        if (key && key.toLowerCase().includes("model") && value) {
          if (readConfig().routing === "express") {
            modelGen.generateModel(value.toString());
            if (readConfig().database === "mysql") {
              mysqlGen.generateConfig(value.toString());
            }
          } else {
            generateModel(
              value.toString(),
              readConfig().database === "mongo" ? true : false,
              readConfig().database === "mysql" ? true : false
            );
          }
        }

        if (key && key.toLowerCase().includes("component") && value) {
          generateComponent(value.toString());
        }

        // generates files for all the above options
        if (key && key.toLowerCase().includes("all") && value) {
          if (readConfig().routing === "express") {
            modelGen.generateModel(value.toString());
          } else {
            generateModel(
              value.toString(),
              readConfig().database === "mongo" ? true : false,
              readConfig().database === "mysql" ? true : false
            );
          }

          if (readConfig().database === "mysql") {
            mysqlGen.generateConfig(value.toString());
          }

          if (readConfig().routing === "express") {
            serviceGen.generateService(value.toString());
            controllerGen.generateController(value.toString());
          } else {
            generateService(
              value.toString(),
              readConfig().database === "mongo" ? true : false,
              readConfig().database === "mysql" ? true : false
            );
          }

          if (readConfig().routing === "express") {
            routesGen.generateRouter(value.toString());
            addRoutesIndexFile(value.toString(), readConfig);
            addServerFile(readConfig);
          } else {
            generateComponent(value.toString());
            addComponentToServerFile(value.toString());
          }
        }
      });

      //   const controllerName = controller ? `${controller}` : undefined;
      //   const serviceName = service ? `${service}` : undefined;
      //   const modelName = model ? `${model}` : undefined;
      //   const routesName = routes ? `${routes}` : undefined;
      //   const interfacesName = interfaces ? `${interfaces}` : undefined;
      //   const helperName = helper ? `${helper}` : undefined;

      //   if (controllerName) {
      //     controllerGen.generateController(controllerName);
      //   }
    });
};

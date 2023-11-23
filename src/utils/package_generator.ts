import { program } from "commander";
import colors from "colors";
import * as controllerGen from "../generators/generate_controller.js";
import * as serviceGen from "../generators/generate_service.js";
import * as routesGen from "../generators/generate_routes.js";
import * as modelGen from "../generators/generate_model.js";
import * as mysqlGen from "../generators/generate_mysql.js";
import { readConfig } from "./read_user_config_path.js";
import { addRoutesIndexFile } from "../registers/register_routes.js";

export const packageGenerator = () => {
  program
    .command("generate")
    .alias("g")
    .option(
      "-s, --service" + colors.bold(colors.blue("<name>")),
      "Generates a dolphjs service file."
    )
    .option(
      "-c, --controller" + colors.bold(colors.blue("<name>")),
      "Generates a dolphjs controller file."
    )
    .option(
      "-r, --routes" + colors.bold(colors.blue("<name>")),
      "Generates a dolphjs routes file."
    )
    .option(
      "-m, --models" + colors.bold(colors.blue("<name>")),
      "Generates a dolphjs models file."
    )
    .option(
      "-a, --all" + colors.bold(colors.blue("<name>")),
      "Generates dolphjs ocntrollers, routes, models and services files for the name paramter."
    )
    // .option(
    //   "-in, --interfaces" + colors.bold(colors.blue("<name>")),
    //   "Generates a dolphjs interfaces file."
    // )
    // .option(
    //   "-hp, --helper" + colors.bold(colors.blue("<name>")),
    //   "Generates a dolphjs helper file."
    // )
    .action(async (name: any, options: any) => {
      Object.entries(name).forEach(([key, value]) => {
        // generates controller files for the paramter name
        if (key && key.toLowerCase().includes("controller") && value) {
          controllerGen.generateController(value.toString());
        }

        // generates service files for the paramter name
        if (key && key.toLowerCase().includes("service") && value) {
          serviceGen.generateService(value.toString());
        }

        // generatess routes files for the paramter name
        if (key && key.toLowerCase().includes("routes") && value) {
          routesGen.generateRouter(value.toString());
          addRoutesIndexFile(value.toString(), readConfig);
        }

        // generatess model fles for the paramter name
        if (key && key.toLowerCase().includes("models") && value) {
          modelGen.generateModel(value.toString());
          if (readConfig().database === "mysql") {
            mysqlGen.generateConfig(value.toString());
          }
        }

        // generates files for all the above options
        if (key && key.toLowerCase().includes("all") && value) {
          modelGen.generateModel(value.toString());
          if (readConfig().database === "mysql") {
            mysqlGen.generateConfig(value.toString());
          }
          serviceGen.generateService(value.toString());
          controllerGen.generateController(value.toString());
          routesGen.generateRouter(value.toString());
          addRoutesIndexFile(value.toString(), readConfig);
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

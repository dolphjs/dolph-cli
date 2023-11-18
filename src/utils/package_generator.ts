import { program } from "commander";
import colors from "colors";
import * as controllerGen from "../generators/generate_controller.js";
import * as serviceGen from "../generators/generate_service.js";
import * as routesGen from "../generators/generate_routes.js";

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
    // .option(
    //   "-m, --model" + colors.bold(colors.blue("<name>")),
    //   "Generates a dolphjs model file."
    // )
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
        if (key && key.toLowerCase().includes("controller") && value) {
          controllerGen.generateController(value.toString());
        }
        if (key && key.toLowerCase().includes("service") && value) {
          serviceGen.generateService(value.toString());
        }
        if (key && key.toLowerCase().includes("routes") && value) {
          routesGen.generateRouter(value.toString());
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

import { program } from "commander";
import { initDolphCli } from "./init_helper_function.js";

export const InitDolphCli = () => {
  program
    .command("new <app-name>")
    .alias("nw")
    .description("Creates a new dolphjs app")
    .action((appname) => {
      initDolphCli(appname);
    });
};

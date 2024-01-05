import { program } from "commander";
import { initDolphCli } from "./init_helper_function.js";

export const InitDolphCli = () => {
  program
    .command("new <project-name>")
    .alias("nw")
    .description("Creates a new dolph app")
    .action((appname) => {
      initDolphCli(appname);
    });
};

import { program } from "commander";
import { initDolphCli } from "./init_helper_function.js";

export const InitDolphCli = () => {
  program
    .command("takeover")
    .alias("tr")
    .description("Creates default config files")
    .action(() => {
      initDolphCli();
    });
};

import { program } from "commander";
import { buildApp, startProdApp, watchFile } from "./watcher.js";

export const watcherConfig = () => {
  program
    .command("start")
    .description("starts the dolph application")
    .option("--bun", "uses bun instead of node to run the command")
    .action((options) => {
      startProdApp(options.bun);
    });
  program
    .command("watch")
    .description("starts the dolph application in watch mode")
    .option("--bun", "uses bun instead of node to run the command")
    .action((options) => {
      watchFile(options.bun);
    });
  program
    .command("build")
    .description("compile a typescript project to javascript")
    .action(() => buildApp());
};

import { program } from "commander";
import { buildApp, startProdApp, watchFile } from "./watcher.js";

export const watcherConfig = () => {
  program
    .command("start")
    .description("starts the dolph application")
    .action(() => startProdApp());
  program
    .command("watch")
    .description("starts the dolph application in watch mode")
    .action(() => watchFile());
  program
    .command("build")
    .description("compile a typescript project to javascript")
    .action(() => buildApp());
};

import { program } from "commander";
import { startApp, watchFile } from "./watcher.js";

export const watcherConfig = () => {
  program
    .command("start")
    .description("starts the dolphjs application")
    .action(() => startApp());
  program
    .command("watch")
    .description("starts the dolphjs application in watch mode")
    .action(() => watchFile());
};

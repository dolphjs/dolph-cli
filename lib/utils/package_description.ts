import chalk from "chalk";
import { program } from "commander";

export const packageDescription = () => {
  program
    .version("1.2.1")
    .description(
      chalk.cyan(
        "The dolph-cli is a tool for efficient intialization and management of a dolphjs project"
      )
    );
};

import chalk from "chalk";
import { program } from "commander";

export const packageDescription = () => {
  program
    .version("1.0.3")
    .description(
      chalk.cyan(
        "The dolphjs-cli is a tool for efficient intialization and management of a dolphjs project"
      )
    );
};

import chalk from "chalk";
import { program } from "commander";

export const packageDescription = () => {
  program
    .version("1.2.2")
    .description(
      chalk.cyan(
        "The dolph-cli is a tool for efficient initialization and management of a dolphjs project"
      )
    );
};

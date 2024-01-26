import chalk from "chalk";

export const dolphMsg = {
  infoGreen: (message: string) =>
    console.log(
      chalk.bold(chalk.green("[DOLPH INFO]: ")) + chalk.greenBright(message)
    ),
  infoYellow: (message: string) =>
    console.log(
      chalk.bold(chalk.yellow("[DOLPH INFO]: ")) + chalk.yellowBright(message)
    ),
  infoBlue: (message: string) =>
    console.log(
      chalk.bold(chalk.blue("[DOLPH INFO]: ")) + chalk.blueBright(message)
    ),
  info: (message: string) =>
    console.log(
      chalk.bold(chalk.blue("[DOLPH INFO]: " + chalk.white(message)))
    ),
  errorRed: (message: string) =>
    console.log(
      chalk.bold(chalk.red("[DOLPH ERROR]: ")) + chalk.redBright(message)
    ),
  errorGray: (message: string) =>
    console.log(
      chalk.bold(chalk.bgGrey("[DOLPH ERROR]: ")) + chalk.grey(message)
    ),
};

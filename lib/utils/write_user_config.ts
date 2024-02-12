import chalk from "chalk";
import yaml from "js-yaml";
import { getUserConfigFilePath } from "./get_user_config_path.js";
import { writeFileSync } from "fs";

const filePath = getUserConfigFilePath();

export const writeConfig = (config: any) => {
  try {
    const yamlString = yaml.dump(config);
    writeFileSync(filePath, yamlString, "utf8");
    console.log(chalk.green("Configurations saved successfully! 😎."));
  } catch (e: any) {
    console.log(
      chalk.bold(
        chalk.red(
          "Error encountered reading config file, please run 'dolph cf' to initialize config file 🥹"
        )
      )
    );
    process.exit(1);
  }
};

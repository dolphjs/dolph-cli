import colors from "colors";
import yaml from "js-yaml";
import { getUserConfigFilePath } from "./get_user_config_path.js";
import { writeFileSync } from "fs";

const filePath = getUserConfigFilePath();

export const writeConfig = (config: any) => {
  try {
    const yamlString = yaml.dump(config);
    writeFileSync(filePath, yamlString, "utf8");
    console.log(colors.green("Configurations saved successfully! 😎."));
  } catch (e: any) {
    console.log(
      colors.bold(
        colors.red(
          "Error encountered reading config file, please run 'dolph-cli tr' to initialize config file 🥹"
        )
      )
    );
    process.exit(1);
  }
};

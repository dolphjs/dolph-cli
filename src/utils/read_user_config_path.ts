import colors from "colors";
import { getUserConfigFilePath } from "./get_user_config_path.js";
import { readFileSync } from "fs";
import yaml from "js-yaml";

const filePath = getUserConfigFilePath();

export const readConfig = () => {
  console.log("read config");
  try {
    const data = readFileSync(filePath, "utf8");
    const yamlData = yaml.load(data);
    const jsonData = JSON.stringify(yamlData);
    return JSON.parse(jsonData.toString());
  } catch (e: any) {
    console.log(e);
    console.log(
      colors.bold(
        colors.red(
          "Error encountered reading config file, please run 'dolph-cli tr' to initialize config file 🥹"
        )
      )
    );
    process.exit(1);
    return {};
  }
};

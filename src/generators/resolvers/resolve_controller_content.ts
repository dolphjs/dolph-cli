// import { readConfig } from "utils/read_user_config_path.js";
import * as generateControllerTemplate from "./../templates/controller_template.js";

export const resolveControllerContent = (
  readConfig: any,
  controllerName: string
) => {
  if (readConfig().language === "js" && readConfig().paradigm === "oop") {
    return generateControllerTemplate.generateOopJsTemplate(controllerName);
  } else if (
    readConfig().language === "js" &&
    readConfig().paradigm === "functional"
  ) {
    return generateControllerTemplate.generateFnJsTemplate(controllerName);
  } else if (
    readConfig().language === "ts" &&
    readConfig().paradigm === "oop"
  ) {
    return generateControllerTemplate.generateOopTsTemplate(controllerName);
  } else if (
    readConfig().language === "ts" &&
    readConfig().paradigm === "functional"
  ) {
    return generateControllerTemplate.generateFnTsTemplate(controllerName);
  }
};

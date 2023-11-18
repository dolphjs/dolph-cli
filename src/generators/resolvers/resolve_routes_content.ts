// import { readConfig } from "utils/read_user_config_path.js";
import * as generateRoutesTemplate from "./../templates/routes_template.js";

export const resolveRoutesContent = (readConfig: any, routerName: string) => {
  if (readConfig().language === "js" && readConfig().paradigm === "oop") {
    return generateRoutesTemplate.generateOopJsTemplate(routerName);
  } else if (
    readConfig().language === "js" &&
    readConfig().paradigm === "functional"
  ) {
    return generateRoutesTemplate.generateFnJsTemplate(routerName);
  } else if (
    readConfig().language === "ts" &&
    readConfig().paradigm === "oop"
  ) {
    return generateRoutesTemplate.generateOopTsTemplate(routerName);
  } else if (
    readConfig().language === "ts" &&
    readConfig().paradigm === "functional"
  ) {
    return generateRoutesTemplate.generateFnTsTemplate(routerName);
  }
};

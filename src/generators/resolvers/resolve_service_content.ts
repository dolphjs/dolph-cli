// import { readConfig } from "utils/read_user_config_path.js";
import * as generateServiceTemplate from "./../templates/service_template.js";

export const resolveServiceContent = (readConfig: any, serviceName: string) => {
  if (readConfig().language === "js" && readConfig().paradigm === "oop") {
    return generateServiceTemplate.generateOopJsTemplate(
      serviceName,
      readConfig().database === "mongo" ? true : false,
      readConfig().database === "mysql" ? true : false
    );
  } else if (
    readConfig().language === "js" &&
    readConfig().paradigm === "functional"
  ) {
    return generateServiceTemplate.generateFnJsTemplate(serviceName);
  } else if (
    readConfig().language === "ts" &&
    readConfig().paradigm === "oop"
  ) {
    return generateServiceTemplate.generateOopTsTemplate(
      serviceName,
      readConfig().database === "mongo" ? true : false,
      readConfig().database === "mysql" ? true : false
    );
  } else if (
    readConfig().language === "ts" &&
    readConfig().paradigm === "functional"
  ) {
    return generateServiceTemplate.generateFnTsTemplate(serviceName);
  }
};

// import { readConfig } from "utils/read_user_config_path.js";
import * as generateModelTemplate from "./../templates/model_template.js";
import * as generateMySqlTemplate from "./../templates/mysql_config_template.js";

export const resolveModelContent = (readConfig: any, modelName: string) => {
  if (readConfig().language === "js" && readConfig().paradigm === "oop") {
    return generateModelTemplate.generateOopJsTemplate(
      modelName,
      readConfig().database === "mongo" ? true : false,
      readConfig().database === "mysql" ? true : false
    );
  } else if (
    readConfig().language === "js" &&
    readConfig().paradigm === "functional"
  ) {
    return generateModelTemplate.generateFnJsTemplate(
      modelName,
      readConfig().database === "mongo" ? true : false,
      readConfig().database === "mysql" ? true : false
    );
  } else if (
    readConfig().language === "ts" &&
    readConfig().paradigm === "oop"
  ) {
    return generateModelTemplate.generateOopTsTemplate(
      modelName,
      readConfig().database === "mongo" ? true : false,
      readConfig().database === "mysql" ? true : false
    );
  } else if (
    readConfig().language === "ts" &&
    readConfig().paradigm === "functional"
  ) {
    return generateModelTemplate.generateFnTsTemplate(
      modelName,
      readConfig().database === "mongo" ? true : false,
      readConfig().database === "mysql" ? true : false
    );
  }
};

export const resolveMySqlContent = (readConfig: any) => {
  if (readConfig().language === "js" && readConfig().paradigm === "oop") {
    return generateMySqlTemplate.generateOopJsTemplate();
  } else if (
    readConfig().language === "js" &&
    readConfig().paradigm === "functional"
  ) {
    return generateMySqlTemplate.generateFnJsTemplate();
  } else if (
    readConfig().language === "ts" &&
    readConfig().paradigm === "oop"
  ) {
    return generateMySqlTemplate.generateOopTsTemplate();
  } else if (
    readConfig().language === "ts" &&
    readConfig().paradigm === "functional"
  ) {
    return generateMySqlTemplate.generateFnTsTemplate();
  }
};

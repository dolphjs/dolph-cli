export const generateSpringService = (
  componentName: string,
  isMongo: boolean,
  isMySql: boolean
) => {
  let template;
  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const className = capitalizeFirstLetter(componentName) + "Service";

  if (isMongo && isMySql) {
    template = `
import { DolphServiceHandler } from "@dolphjs/dolph/classes";
import { Dolph } from "@dolphjs/dolph/common";
import { InjectMongo, InjectMySQL } from "@dolphjs/dolph/decorators";
import { Model } from "mongoose";
import { ModelStatic, Model as SqlModel } from "sequelize";
import { ${capitalizeFirstLetter(componentName)}Model, I${capitalizeFirstLetter(
      componentName
    )} } from "./${componentName}.model";


@InjectMongo("${componentName}Model", ${capitalizeFirstLetter(
      componentName
    )}Model)
@InjectMySQL("${componentName}SqlModel", )
export class ${className} extends DolphServiceHandler<Dolph> {
  ${componentName}Model!: Model<${capitalizeFirstLetter(componentName)}>;
  ${componentName}SqlModel!: ModelStatic<SqlModel<any, any>>;


  constructor() {
    super("${className.toLowerCase()}");
  }
}
    
`;
  }

  if (isMongo) {
    template = `
import { DolphServiceHandler } from "@dolphjs/dolph/classes";
import { Dolph } from "@dolphjs/dolph/common";
import { InjectMongo} from "@dolphjs/dolph/decorators";
import { Model } from "mongoose";
import { ${capitalizeFirstLetter(componentName)}Model, I${capitalizeFirstLetter(
      componentName
    )} } from "./${componentName}.model";


@InjectMongo("${componentName}Model", ${capitalizeFirstLetter(
      componentName
    )}Model)
export class ${className} extends DolphServiceHandler<Dolph> {
  ${componentName}Model!: Model<>;

  constructor() {
    super("${className.toLowerCase()}");
  }
}
    
`;
  }

  if (isMySql) {
    template = `
import { DolphServiceHandler } from "@dolphjs/dolph/classes";
import { Dolph } from "@dolphjs/dolph/common";
import { InjectMySQL } from "@dolphjs/dolph/decorators";
import { ModelStatic, Model } from "sequelize";


@InjectMySQL("${componentName}Model", )
export class ${className} extends DolphServiceHandler<Dolph> {
  ${componentName}Model!: ModelStatic<Model<any, any>>;


  constructor() {
    super("${className.toLowerCase()}");
  }
}
    
`;
  }

  if (!isMongo && !isMySql) {
    template = `
import { DolphServiceHandler } from "@dolphjs/dolph/classes";
import { Dolph } from "@dolphjs/dolph/common";


export class ${className} extends DolphServiceHandler<Dolph> {

  constructor() {
    super("${className.toLowerCase()}");
  }
}    
`;
  }
  return template;
};

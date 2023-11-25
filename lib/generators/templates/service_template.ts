const generateOopTsTemplate = (
  serviceName: string,
  isMongo: Boolean,
  isMySql: Boolean
) => {
  let template;
  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const className = capitalizeFirstLetter(serviceName) + "Service";

  if (isMongo && isMySql) {
    template = `
import { DolphServiceHandler } from "@dolphjs/dolph/classes";
import { Dolph } from "@dolphjs/dolph/common";
import { InjectMongo, InjectMySQL } from "@dolphjs/dolph/decorators";
import { Model } from "mongoose";
import { ModelStatic, Model as SqlModel } from "sequelize";


@InjectMongo("${serviceName}Model", )
@InjectMySQL("${serviceName}SqlModel", )
export class ${className} extends DolphServiceHandler<Dolph> {
  ${serviceName}Model!: Model<>;
  ${serviceName}SqlModel!: ModelStatic<SqlModel<any, any>>;


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


@InjectMongo("${serviceName}Model", )
export class ${className} extends DolphServiceHandler<Dolph> {
  ${serviceName}Model!: Model<>;

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


@InjectMySQL("${serviceName}Model", )
export class ${className} extends DolphServiceHandler<Dolph> {
  ${serviceName}Model!: ModelStatic<Model<any, any>>;


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

const generateOopJsTemplate = (
  serviceName: string,
  isMongo: Boolean,
  isMySql: Boolean
) => {
  let template;
  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const className = capitalizeFirstLetter(serviceName) + "Service";

  if (isMongo && isMySql) {
    template = `
const { DolphServiceHandler } = require("@dolphjs/dolph/classes");

class ${className} extends DolphServiceHandler {

  constructor() {
    super("${className.toLowerCase()}");
  }
}
    
`;
  }

  if (isMongo) {
    template = `
const { DolphServiceHandler } = require("@dolphjs/dolph/classes");

export class ${className} extends DolphServiceHandler {

  constructor() {
    super("${className.toLowerCase()}");
  }
}
    
`;
  }

  if (isMySql) {
    template = `
const { DolphServiceHandler } = require("@dolphjs/dolph/classes");

export class ${className} extends DolphServiceHandler {

  constructor() {
    super("${className.toLowerCase()}");
  }
}
    
`;
  }

  if (!isMongo && !isMySql) {
    template = `
const { DolphServiceHandler } = require("@dolphjs/dolph/classes");


export class ${className} extends DolphServiceHandler {

  constructor() {
    super("${className.toLowerCase()}");
  }
}    

module.exports = { ${className} }
`;
  }
  return template;
};

const generateFnTsTemplate = (serviceName: string) => {
  let template;

  template = `
import { TryCatchAsyncFn } from "@dolphjs/dolph/common";

export const default${serviceName}Service = TryCatchAsyncFn(async (data: string) => {
  return { data };
});

`;
  return template;
};

const generateFnJsTemplate = (serviceName: string) => {
  let template;

  template = `
const { TryCatchAsyncFn } = require("@dolphjs/dolph/classes");

const default${serviceName}Service = TryCatchAsyncFn(async (data) => {
  return { data };
});

module.exports = { default${serviceName}Service }
`;
  return template;
};

export {
  generateFnJsTemplate,
  generateFnTsTemplate,
  generateOopJsTemplate,
  generateOopTsTemplate,
};

const generateOopTsTemplate = (
  modelName: string,
  isMongo: boolean,
  isMysql: boolean
) => {
  let template;
  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  if (isMongo) {
    template = `
import { Schema, Document, model } from "mongoose";

export interface I${capitalizeFirstLetter(modelName)} extends Document {
  
}

const ${capitalizeFirstLetter(modelName)}Schema = new Schema(
    {

    }
);

export const ${capitalizeFirstLetter(
      modelName
    )}Model = model<I${capitalizeFirstLetter(modelName)}>("${
      modelName.inverse.charAt(0) !== "s" ? `${modelName}s` : modelName
    }", ${capitalizeFirstLetter(modelName)}Schema);
`;
  }

  if (isMysql) {
    template = `
import { sequelizeInstance } from "@/configs/db.configs";
import { DataTypes } from "sequelize";

export const ${capitalizeFirstLetter(
      modelName
    )} = sequelizeInstance.define("${modelName}", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
});
`;
  }
  return template;
};

const generateOopJsTemplate = (
  modelName: string,
  isMongo: boolean,
  isMysql: boolean
) => {
  let template;
  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  if (isMongo) {
    template = `
const { Schema, model } = require("mongoose");

const ${capitalizeFirstLetter(modelName)}Schema = new Schema(
    {

    }
);

const ${capitalizeFirstLetter(modelName)}Model = model("${
      modelName.inverse.charAt(0) !== "s" ? `${modelName}s` : modelName
    }", ${capitalizeFirstLetter(modelName)}Schema);

module.exports = { ${capitalizeFirstLetter(modelName)}Model }
`;
  }

  if (isMysql) {
    template = `
const { sequelizeInstance } = require("../../../configs/db");
const { DataTypes } = require("sequelize");

const User = sequelizeInstance.define("user", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
});

module.exports = { ${capitalizeFirstLetter(modelName)} };
`;
  }
  return template;
};

const generateFnTsTemplate = (
  modelName: string,
  isMongo: boolean,
  isMysql: boolean
) => {
  let template;
  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  if (isMongo) {
    template = `
import { Schema, Document, model } from "mongoose";

export interface I${capitalizeFirstLetter(modelName)} extends Document {
  
}

const ${capitalizeFirstLetter(modelName)}Schema = new Schema(
    {

    }
);

export const ${capitalizeFirstLetter(
      modelName
    )}Model = model<I${capitalizeFirstLetter(modelName)}>("${
      modelName.inverse.charAt(0) !== "s" ? `${modelName}s` : modelName
    }", ${capitalizeFirstLetter(modelName)}Schema);
`;
  }
  if (isMysql) {
    template = `
import { sequelizeInstance } from "@/configs/db.configs";
import { DataTypes } from "sequelize";

export const ${capitalizeFirstLetter(
      modelName
    )} = sequelizeInstance.define("${modelName}", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
});
`;
  }
  return template;
};

const generateFnJsTemplate = (
  modelName: string,
  isMongo: boolean,
  isMysql: boolean
) => {
  let template;
  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  if (isMongo) {
    template = `
const { Schema, model } = require("mongoose");

const ${capitalizeFirstLetter(modelName)}Schema = new Schema(
    {

    }
);

const ${capitalizeFirstLetter(modelName)}Model = model("${
      modelName.inverse.charAt(0) !== "s" ? `${modelName}s` : modelName
    }", ${capitalizeFirstLetter(modelName)}Schema);

module.exports = { ${capitalizeFirstLetter(modelName)}Model };
`;
  }
  if (isMysql) {
    template = `
const { sequelizeInstance } = require("../../../configs/db");
const { DataTypes } = require("sequelize");

const User = sequelizeInstance.define("user", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
});

module.exports = { ${capitalizeFirstLetter(modelName)} };
`;
  }
  return template;
};

export {
  generateFnJsTemplate,
  generateFnTsTemplate,
  generateOopJsTemplate,
  generateOopTsTemplate,
};

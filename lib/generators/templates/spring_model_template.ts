export const generateSpringModel = (
  componentName: string,
  isMongo: boolean,
  isMysql: boolean
) => {
  let template;
  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  if (isMongo) {
    template = `import { Schema, Document, model } from "mongoose";

export interface I${capitalizeFirstLetter(componentName)} extends Document {
  
}

const ${capitalizeFirstLetter(componentName)}Schema = new Schema(
    {

    }
);

export const ${capitalizeFirstLetter(
      componentName
    )}Model = model<I${capitalizeFirstLetter(componentName)}>("${
      componentName.charAt(0) !== "s" ? `${componentName}s` : componentName
    }", ${capitalizeFirstLetter(componentName)}Schema);
`;
  }

  if (isMysql) {
    template = `import { sequelizeInstance } from "@/shared/configs/db.configs";
import { DataTypes } from "sequelize";

export const ${capitalizeFirstLetter(
      componentName
    )} = sequelizeInstance.define("${componentName}", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
});
`;
  }

  if (!isMongo && !isMysql) {
    template = ``;
  }
  return template;
};

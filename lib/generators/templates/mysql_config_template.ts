const generateOopTsTemplate = () => {
  let template;

  template = `
import { initMySql } from "@dolphjs/dolph/packages";
import {} from ".."

export const sequelizeInstance = initMySql(
  "dolph",
  "root",
  "password",
  "localhost"
);

`;

  return template;
};

const generateOopJsTemplate = () => {
  let template;

  template = `
const { initMySql } = require("@dolphjs/dolph/packages");
const  {} = require("..");

const sequelizeInstance = initMySql("dolph", "root", "password", "localhost");

module.exports = { sequelizeInstance };

`;

  return template;
};

const generateFnTsTemplate = () => {
  let template;

  template = `
import { initMySql } from "@dolphjs/dolph/packages";
import {} from ".."

export const sequelizeInstance = initMySql(
  "dolph",
  "root",
  "password",
  "localhost"
);

`;

  return template;
};

const generateFnJsTemplate = () => {
  let template;

  template = `
const { initMySql } = require("@dolphjs/dolph/packages");
const  {} = require("..");

const sequelizeInstance = initMySql("dolph", "root", "password", "localhost");

module.exports = { sequelizeInstance };

`;

  return template;
};

export {
  generateFnJsTemplate,
  generateFnTsTemplate,
  generateOopJsTemplate,
  generateOopTsTemplate,
};

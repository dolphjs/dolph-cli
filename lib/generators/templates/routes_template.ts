const generateOopTsTemplate = (routerName: string) => {
  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const className = capitalizeFirstLetter(routerName) + "Router";
  const path = `/${
    routerName.charAt(0) === "s" ? routerName : `${routerName}s`
  }`;

  const template = `
import { DolphRouteHandler } from "@dolphjs/dolph/classes";
import { Dolph } from "@dolphjs/dolph/common";

export class ${className} extends DolphRouteHandler<Dolph> {
  constructor() {
    super();
    this.initRoutes();
  }

  public readonly path: string = "${path}";
  controller;

  initRoutes(): void {
    this.router.get();
  }
}
`;

  return template;
};

const generateOopJsTemplate = (routerName: string) => {
  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const className = capitalizeFirstLetter(routerName) + "Router";
  const path = `/${
    routerName.charAt(0) === "s" ? routerName : `${routerName}s`
  }`;

  const template = `
const { DolphRouteHandler } = require("@dolphjs/dolph/classes");

class ${className} extends DolphRouteHandler {
  constructor() {
    super();
    this.initRoutes();
  }

  path = "${path}";
  controller;

  initRoutes() {
    this.router.get();
  }
}

module.exports = { ${className} };
`;

  return template;
};

const generateFnTsTemplate = (routerName: string) => {
  const path = `/${routerName}`;

  const template = `
import { Router } from "express";

const router = Router();
router.get();

export const ${routerName}Routes = {
  path: "${path}",
  router,
};
`;

  return template;
};

const generateFnJsTemplate = (routerName: string) => {
  const path = `/${routerName}`;

  const template = `
const { Router } = require("express");

const router = Router();
router.get();

const ${routerName}Routes = {
  path: "${path}",
  router,
};

module.exports = { ${routerName}Routes };
`;

  return template;
};

export {
  generateFnJsTemplate,
  generateFnTsTemplate,
  generateOopJsTemplate,
  generateOopTsTemplate,
};

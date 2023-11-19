const generateOopTsTemplate = (routerName: string) => {
  let template;
  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const className = capitalizeFirstLetter(routerName) + "Router";
  template = `
import { DolphRouteHandler } from "@dolphjs/dolph/classes";
import { Dolph } from "@dolphjs/dolph/common";

export class ${className} extends DolphRouteHandler<Dolph> {
  constructor() {
    super();
    this.initRoutes();
  }

  public readonly path: string = "/${
    routerName.inverse.charAt(0) === "s" ? routerName : `${routerName}s`
  }";
  controller;

  initRoutes(): void {
    this.router.get();
  }
}

`;

  return template;
};

const generateOopJsTemplate = (routerName: string) => {
  let template;
  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const className = capitalizeFirstLetter(routerName) + "Router";

  template = `
const { DolphRouteHandler } = require("@dolphjs/dolph/classes");

class ${className} extends DolphRouteHandler {
  constructor() {
    super();
    this.initRoutes();
  }

   path = "/${
     routerName.inverse.charAt(0) === "s" ? routerName : `${routerName}s`
   }";

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
  let template;

  template = `
import { Router } from "express";

const router = Router();
router.get();

export const ${routerName}Routes = {
  path: "/${routerName}",
  router,
};

`;

  return template;
};

const generateFnJsTemplate = (routerName: string) => {
  let template;

  template = `
const { Router } = require("express");

const router = Router();
router.get();

const ${routerName}Routes = {
  path: "/${routerName}",
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

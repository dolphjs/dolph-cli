const generateOopTsTemplate = (controllerName: string) => {
  let template;
  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const className = capitalizeFirstLetter(controllerName) + "Controller";
  template = `import { DolphControllerHandler } from "@dolphjs/dolph/classes";
import {
  Dolph,
  SuccessResponse,
  TryCatchAsyncDec,
  DRequest,
  DResponse
} from "@dolphjs/dolph/common";

export class ${className} extends DolphControllerHandler<Dolph> {
  constructor() {
    super();
  }

  @TryCatchAsyncDec
  public async defaultMethod (req: DRequest, res: DResponse) {
    SuccessResponse({ res, body: { message: "${controllerName} is working!" } });
  }
}
`;

  return template;
};

const generateOopJsTemplate = (controllerName: string) => {
  let template;
  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const className = capitalizeFirstLetter(controllerName) + "Controller";

  template = `const { DolphControllerHandler } = require("@dolphjs/dolph/classes");
const {
  SuccessResponse,
  TryCatchAsyncFn,
} = require("@dolphjs/dolph/common");

class ${className} extends DolphControllerHandler {
  constructor() {
    super();
  }

  defaultMethod = TryCatchAsyncFn (async (req, res) => {
    SuccessResponse({ res, body: { message: "${controllerName} is working!" } });
  });
}

module.exports = { ${className} }
`;

  return template;
};

const generateFnTsTemplate = (controllerName: string) => {
  let template;

  template = `import { TryCatchAsyncFn, SuccessResponse, DRequest, DResponse } from "@dolphjs/dolph/common";

export const defaultFunc = TryCatchAsyncFn(async (req: DRequest, res: DResponse) => {
  SuccessResponse({ res, body: { message: "${controllerName} working!" } });
});

`;

  return template;
};

const generateFnJsTemplate = (controllerName: string) => {
  let template;

  template = `const { TryCatchAsyncFn, SuccessResponse } = require("@dolphjs/dolph/common");

const defaultFunc = TryCatchAsyncFn(async (req, res) => {
  SuccessResponse({ res, body: { message: "${controllerName} working!" } });
});

module.exports = { defaultFunc };

`;

  return template;
};

export {
  generateFnJsTemplate,
  generateFnTsTemplate,
  generateOopJsTemplate,
  generateOopTsTemplate,
};

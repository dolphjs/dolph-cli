export const generateSpringController = (componentName: string) => {
  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const className = capitalizeFirstLetter(componentName) + "Controller";

  const template = `import { DolphControllerHandler } from "@dolphjs/dolph/classes";
import {
  Dolph,
  SuccessResponse,
  DRequest,
  DResponse
} from "@dolphjs/dolph/common";
import { Get, Route } from "@dolphjs/dolph/decorators";

@Route('${componentName}')
export class ${className} extends DolphControllerHandler<Dolph> {
  constructor() {
    super();
  }

  @Get("greet")
  async greet (req: DRequest, res: DResponse) {
    SuccessResponse({ res, body: { message: "you've reached the ${componentName} endpoint." } });
  }
}
`;

  return template;
};

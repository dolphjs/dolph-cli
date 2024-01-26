export const generateSpringComponent = (componentName: string) => {
  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const className = capitalizeFirstLetter(componentName) + "Component";

  const template = `import { Component } from "@dolphjs/dolph/decorators";

@Component({ controllers: [] })
export class ${className} {}
`;

  return template;
};

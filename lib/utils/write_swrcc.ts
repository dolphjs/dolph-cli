import * as fs from "fs";
import { getRootDirectory } from "./get_root_dir_path.js";
import { join } from "path";

export function writeSwcrc(): void {
  const swcrcContent = `
{
  "jsc": {
    "parser": {
      "syntax": "typescript",
      "tsx": false,
      "dynamicImport": true,
      "decorators": true
    },
    "transform": {
      "legacyDecorator": true,
      "decoratorMetadata": true
    },
    "target": "es2022",
    "externalHelpers": false,
    "keepClassNames": true,
    "loose": false,
    "minify": {
      "compress": false,
      "mangle": false
    },
    "baseUrl": "src",
    "paths": {
      "@/*": ["*"],
      "@configs/*": ["configs/*"],
      "@controllers/*": ["controllers/*"],
      "@dtos/*": ["dtos/*"],
      "@interfaces/*": ["interfaces/*"],
      "@middlewares/*": ["middlewares/*"],
      "@models/*": ["models/*"],
      "@routes/*": ["routes/*"],
      "@services/*": ["services/*"],
      "@utils/*": ["utils/*"],
      "@constants/*": ["constants/*"],
      "@validations/*": ["validations/*"]
    }
  },
  "module": {
    "type": "commonjs"
  }
}    
`;

  const filePath = join(getRootDirectory(), ".swcrc");

  fs.writeFileSync(filePath, swcrcContent, { encoding: "utf-8" });
}

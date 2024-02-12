import * as fs from "fs";
import { getRootDirectory } from "./get_root_dir_path.js";
import { join } from "path";

export function writeSwcrc(isSpring: boolean): void {
  let swcrcContent = ``;

  if (!isSpring) {
    swcrcContent = `{
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
      "@/configs/*": ["configs/*"],
      "@/controllers/*": ["controllers/*"],
      "@/dtos/*": ["dtos/*"],
      "@/interfaces/*": ["interfaces/*"],
      "@/middlewares/*": ["middlewares/*"],
      "@/models/*": ["models/*"],
      "@/routes/*": ["routes/*"],
      "@/services/*": ["services/*"],
      "@/utils/*": ["utils/*"],
      "@/constants/*": ["constants/*"],
      "@/validations/*": ["validations/*"]
    }
  },
  "module": {
    "type": "commonjs"
  }
}    
`;
  } else {
    swcrcContent = `{
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
      "@/configs/*": ["shared/configs/*"],
      "@/components/*": ["components/*"],
      "@utils/*": ["shared/utils/*"],
      "@shields/*": ["shared/shields/*"],
      "@shared/*": ["shared/*"],
      "@/helpers*": ["shared/helpers/*"],
      "@/interfaces/*": ["shared/interfaces/*"],
      "@/middlewares/*": ["shared/middlewares/*"],
      "@/decorators/*": ["shared/decorators/*"],
      "@/services/*": ["shared/services/*"],
      "@/constants/*": ["shared/constants/*"],
      "@/validations/*": ["shared/validations/*"]
    }
  },
  "module": {
    "type": "commonjs"
  }
}    
`;
  }

  const filePath = join(getRootDirectory(), ".swcrc");

  fs.writeFileSync(filePath, swcrcContent, { encoding: "utf-8" });
}

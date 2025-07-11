import * as fs from "fs";
import { getRootDirectory } from "./get_root_dir_path.js";
import { join } from "path";

export function writeTsConfigFile(isSpring: boolean): void {
  let tsConfigContent = ``;

  if (!isSpring) {
    tsConfigContent = `
    {
  "exclude": ["node_modules"],
  "compilerOptions": {
    "allowJs": false,
    "declaration": false,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "sourceMap": false,
    "useUnknownInCatchVariables": false,
    "strictFunctionTypes": false,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "target": "ES2022",
    "baseUrl": "src",
    "outDir": "app",
    "pretty": true,
    "module": "commonjs",
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
    }
  },
  "include": ["src/", ".env"],
  "ts-node": {
    "compilerOptions": {
      "module": "CommonJS"
    }
  }
}
    `;
  } else {
    tsConfigContent = `
    {
  "exclude": ["node_modules"],
  "compilerOptions": {
    "allowJs": false,
    "declaration": false,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "sourceMap": false,
    "useUnknownInCatchVariables": false,
    "strictFunctionTypes": false,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "target": "ES2022",
    "baseUrl": "src",
    "outDir": "app",
    "pretty": true,
    "module": "commonjs",
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
  "include": ["src/", ".env"],
  "ts-node": {
    "compilerOptions": {
      "module": "CommonJS"
    }
  }
}
    `;
  }

  const filePath = join(getRootDirectory(), "tsconfig.json");

  fs.writeFileSync(filePath, tsConfigContent, { encoding: "utf-8" });
}

import * as fs from "fs";
import { join } from "path";
import { getRootDirectory } from "./get_root_dir_path.js";

export function writePackageJsonFile(name: string, extension: string): void {
  const packageJsonContent =
    extension === "ts"
      ? `
{
  "name": "${name}",
  "version": "1.0.0",
  "main": "app/server.js",
  "author": "",
  "license": "MIT",
  "engines": {
    "node": ">=18.0.0"
  },
  "scripts": {
    "dev:start": "cross-env NODE_ENV=development nodemon",
    "dev:docker:start": "docker-compose -f docker-compose-dev.yml up",
    "dev:docker:stop": "docker-compose -f docker-compose-dev.yml down",
    "build": "swc src -d app --source-maps --copy-files",
    "build:tsc": "tsc && tsc-alias",
    "prod:start": "node app/server.js",
    "clean": "rm -r app && rm -r logs",
    "start": "npm run build && npm run prod:start"
  },
  "dependencies": {
    "@dolphjs/dolph": "^1.1.0"
  },
  "devDependencies": {
    "@swc/cli": "^0.1.62",
    "@swc/core": "^1.3.91",
    "@types/express": "^4.17.18",
    "@types/node": "^20.8.2",
    "cross-env": "^7.0.3",
    "ts-node": "^10.9.1",
    "tsc-alias": "^1.8.8",
    "tsconfig-paths": "^4.2.0",
    "typescript": "^5.2.2"
  }
}
`
      : `
{
  "name": "${name}",
  "version": "1.0.0",
  "main": "src/server.js",
  "author": "",
  "license": "MIT",
  "engines": {
    "node": ">=18.0.0"
  },
  "scripts": {
    "dev:start": "cross-env NODE_ENV=development nodemon",
    "dev:docker:start": "docker-compose -f docker-compose-dev.yml up",
    "dev:docker:stop": "docker-compose -f docker-compose-dev.yml down",
    "prod:start": "node src/server.js",
    "clean": "rm -r logs",
    "start": "npm run prod:start"
  },
  "dependencies": {
    "@dolphjs/dolph": "^1.1.0"
  },
  "devDependencies": {
    "cross-env": "^7.0.3"
  }
}
`;

  const filePath = join(getRootDirectory(), "package.json");

  fs.writeFileSync(filePath, packageJsonContent, { encoding: "utf-8" });
}
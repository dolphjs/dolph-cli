import { readFileSync } from "fs";
import path from "path";

const packageJsonPath = path.join(process.cwd(), "package.json");
const packageJsonContent = readFileSync(packageJsonPath, "utf8");
const packageJson = JSON.parse(packageJsonContent);

const version = packageJson.version;
const name = packageJson.name;
const description = packageJson.description;

export { version, name, description };

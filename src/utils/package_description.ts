import colors from "colors";
import { program } from "commander";
import { description, version } from "./read_package_json.js";

export const packageDescription = () => {
  program.version(version).description(colors.cyan(description));
};

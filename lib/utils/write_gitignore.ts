import * as fs from "fs";
import { getRootDirectory } from "./get_root_dir_path.js";
import { join } from "path";

export function writeGitignore(): void {
  const gitignoreContent = `node_modules
.env
logs
yarn-error.log
app
`;

  const filePath = join(getRootDirectory(), ".gitignore");

  fs.writeFileSync(filePath, gitignoreContent, { encoding: "utf-8" });
}

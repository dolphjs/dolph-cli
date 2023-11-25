import * as fs from "fs";
import { getRootDirectory } from "./get_root_dir_path.js";
import { join } from "path";

export function writeDolphConfig(): void {
  const dolphConfigContent = `
port: 3300    
`;

  const filePath = join(getRootDirectory(), "dolph_config.yaml");

  fs.writeFileSync(filePath, dolphConfigContent, { encoding: "utf-8" });
}

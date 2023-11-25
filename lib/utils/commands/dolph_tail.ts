import { runCommand } from "./run_command.js";


export function dolphTail( filePath: string) {
  runCommand(filePath).then((output: any) => {
    console.log(output);
  }).catch((error: any) => {
    console.log(error);
    process.exit(1);
  });
}
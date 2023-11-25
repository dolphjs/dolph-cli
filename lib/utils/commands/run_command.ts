import { spawn } from 'child_process';

function runCommand(filePath: string): Promise<string | null> {
  return new Promise((resolve, reject) => {
    const nodemon = spawn('nodemon', [filePath]);

    let output = '';

    nodemon.stdout.on('data', (data) => {
      output += data.toString();
      console.log(output);
    });

    nodemon.stderr.on('data', (data) => {
      const error = output + data.toString();
      console.error(error);
      reject(error);
    });

    nodemon.on('close', (code) => {
      if (code === 0) {
        resolve(output);
      } else {
        const error = `Process exited with code ${code}`;
        console.error(error);
        reject(error);
      }
    });
  });
}

export { runCommand };

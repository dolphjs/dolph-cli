import * as os from "os";
import * as fs from "fs";
import * as path from "path";
import * as https from "https";
import * as http from "http";

import chalk from "chalk";

async function downloadBinary() {
  const platform = os.platform(); // 'darwin', 'linux', 'win32'
  const arch = os.arch(); // 'x64', 'arm64'

  let binaryName = "dolph";
  let releaseAssetName = ""; // e.g., 'dolph-x86_64-apple-darwin.tar.gz' or 'dolph-x86_64-pc-windows-msvc.zip'

  // Map Node.js platform/arch to the Rust target triples and asset names
  if (platform === "darwin") {
    if (arch === "arm64") {
      releaseAssetName = "dolph-aarch64-apple-darwin";
    } else {
      // x64
      releaseAssetName = "dolph-x86_64-apple-darwin";
    }
    // macOS binaries are often just executable, not compressed, or .tar.gz
    binaryName = "dolph"; // No .exe extension
  } else if (platform === "win32") {
    releaseAssetName = "dolph-x86_64-pc-windows-msvc";
    binaryName = "dolph.exe";
  } else if (platform === "linux") {
    releaseAssetName = "dolph-x86_64-unknown-linux-gnu";
    binaryName = "dolph";
  } else {
    console.error(`Unsupported platform: ${platform}-${arch}`);
    process.exit(1);
  }

  const version = require("../package.json").version; // Get version from package.json
  let releaseUrl = `https://github.com/dolphjs/cli-v2/releases/download/v${version}/${releaseAssetName}.tar.gz`;

  if (platform === "win32") {
    releaseUrl = `https://github.com/dolphjs/cli-v2/releases/download/v${version}/${releaseAssetName}.zip`;
  }

  // Temporary - this for testing purpose.
  if (platform === "darwin") {
    releaseUrl = `https://github.com/dolphjs/cli_v2/releases/download/v0.1.0/dolph-x86_64-apple-darwin.tar.gz`;
  }

  // Where to put the binary
  const installDir = path.join(__dirname, "..", "bin");

  if (!fs.existsSync(installDir)) {
    fs.mkdirSync(installDir, { recursive: true });
  }

  //   const binaryPath = path.join(installDir, binaryName);

  const binaryPath = path.join(__dirname, "..", "bin", binaryName);

  console.log(
    `${chalk.blue("[INFO]: ")} ${chalk.blue(
      `Downloading DolphJS CLI for ${platform}-${arch} from ${releaseUrl}...`
    )}`
  );

  try {
    await downloadWithRedirects(releaseUrl, binaryPath);
    fs.chmodSync(binaryPath, "755");
    console.log(
      `${chalk.blue("[INFO]: ")} ${chalk.blue(
        `DolphJS CLI downloaded and installed successfully!`
      )}`
    );
  } catch (error: any) {
    console.log(
      `${chalk.red("[ERROR]: ")} ${chalk.redBright(
        `Error downloading DolphJS CLI: ${error?.message || error}`
      )}`
    );
    process.exit(1);
  }
}

function downloadWithRedirects(url, filePath, maxRedirects = 5) {
  return new Promise<void>((resolve, reject) => {
    if (maxRedirects < 0) {
      return reject(new Error("Too many redirects"));
    }

    const parsedUrl = new URL(url);
    const httpModule = parsedUrl.protocol === "https:" ? https : http;

    const request = httpModule.get(url, (response) => {
      // Handle redirects
      if (
        response.statusCode >= 300 &&
        response.statusCode < 400 &&
        response.headers.location
      ) {
        const redirectUrl = response.headers.location.startsWith("http")
          ? response.headers.location
          : new URL(response.headers.location, url).href;

        console.log(`Redirecting to: ${redirectUrl}`);
        return downloadWithRedirects(redirectUrl, filePath, maxRedirects - 1)
          .then(resolve)
          .catch(reject);
      }

      // Handle error status codes
      if (response.statusCode < 200 || response.statusCode >= 300) {
        return reject(
          new Error(
            `Failed to download binary: HTTP status code ${response.statusCode}`
          )
        );
      }

      // Create write stream and pipe response
      const file = fs.createWriteStream(filePath);
      response.pipe(file);

      file.on("finish", () => {
        file.close(() => resolve());
      });

      file.on("error", (err) => {
        // Delete file on error
        fs.unlink(filePath, () => reject(err));
      });
    });

    request.on("error", (err) => reject(err));
  });
}

downloadBinary();

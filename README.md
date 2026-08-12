# DolphJS CLI

The `dolph` CLI is a powerful tool designed for the efficient initialization and management of DolphJS projects. Powered by Rust under the hood for blazing fast performance!

## Installation

```bash
npm install -g @dolphjs/cli
# or using pnpm
pnpm add -g @dolphjs/cli
```

## Commands

### `new`

This command is used to initialize and start a new project. It takes the name of the project as an option.

```bash
dolph new <project-name>
```

Or use `.` in place of `<project-name>` to initialize the project in your current directory:
```bash
dolph new .
```

After running this, you'll be prompted with interactive questions to configure your new DolphJS project (Language, Architecture, Database, etc.).

### `generate` (or `g`)

This command is used to quickly scaffold boilerplate files and folders with setup code. This ensures you are writing code the standard DolphJS way.

```bash
dolph generate [OPTIONS]
```

**Options:**
- `-a, --all <NAME>`: Generates all dolphjs files for the named parameter
- `-c, --controller <NAME>`: Generates a dolphjs controller file
- `-d, --dto <NAME>`: Generates a dolphjs dto file
- `-e, --entity <NAME>`: Generates a dolphjs entity file
- `-i, --input <NAME>`: Generates a dolphjs input file
- `-k, --socket <NAME>`: Generates a dolphjs socket service and component
- `-m, --model <NAME>`: Generates a dolphjs models file
- `-r, --route <NAME>`: Generates a dolphjs routes file
- `-s, --service <NAME>`: Generates a dolphjs service file
- `-v, --resolver <NAME>`: Generates a dolphjs resolver file
- `-y, --component <NAME>`: Generates a dolphjs spring component file

**Example Usage:**

To generate a full set of files (controller, service, model, routes, etc.) for a `user` feature:
```bash
dolph generate -a user
```

To generate just a specific file, such as a controller:
```bash
dolph generate -c user
```

### `build`

Builds the dolphjs typescript project into a javascript project for production.

```bash
dolph build
```

### `start`

Starts the dolphjs server in production mode.

```bash
dolph start
```

### `watch`

Starts the dolphjs server in development mode (with hot-reloading).

```bash
dolph watch
```

## Credit

dolphjs-cli was originally inspired by methane-cli.

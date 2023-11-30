# dolphjs cli

The dolphjs-cli is a tool used for efficient initialization and management of a dolphjs project.

## Commands

**new**: the alias for this command is `n`. This command is used to initialize / start a new project. It takes the name of the project as an option

```bash
dolph-cli new <project-name>
```

or use `' . '` in place of `<project-name>` to initialize the project in current directory.

After this, you'll be prompted with few questions which would be used to configure your dolphjs project. Navigate to the project folder and run

```bash
yarn
```

to install all packages .

**generate**: the alias for this command is `g` and is used to generate files and folders with setup code for :

- controllers
- services
- models
- routes

It is recommended to make use of the `generate` command when one wants to create these files because it generates code the dolphjs way. In a scenario when you want to create files for all of the above, let's say you want to write code for user logic and functionalities, use the `-a` flag, as in:

```bash
dolph-cli g -a user
```

the command above creates a service, controller, model and routes file for `user` and set's you up for writing business logic. Alternatively, you might want to create one of the files (controllers, models, services, routes) so you make use of their independent flags:

- controller:

  ```bash
  dolph-cli g -c <name>
  ```

- service:

  ```bash
  dolph-cli g -s <name>
  ```

- model:

  ```bash
  dolph-cli g -m <name>
  ```

- route:

  ```bash
  dolph-cli g -r <name>
  ```

## Credit

dolphjs-cli is inspired by methane-cli [https://github.com/adedoyin-Emmanuel/methane-cli]

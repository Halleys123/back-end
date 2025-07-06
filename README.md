# Back-end Template

## Used Technologies

- Node.js
- TypeScript
- Express.js
- Jest
- ESLint
- Prettier
- Docker

## Planned Technologies

- Husky
- MongoDB
- Mongoose
- Swagger
- Kubernetes
- Redis

## Prettier Rules

1. **3 spaces for indentation:**  
   Use exactly three spaces for each indentation level in your code.

2. **Trailing commas where valid in ES5 (objects, arrays, etc.):**  
   Add trailing commas to the last element in objects and arrays when allowed by ES5.

3. **Semicolons at the end of statements:**  
   Always terminate statements with a semicolon to avoid automatic semicolon insertion issues.

4. **Single quotes for strings:**  
   Prefer single quotes (`'`) over double quotes (`"`) for all string literals.

5. **Quote properties only when required:**  
   Only add quotes around object property names if they are not valid identifiers.

6. **Space after colons in object literals:**  
   Insert a space after the colon when defining key-value pairs in objects for readability.

## Lint Rules

1. Can't use `as any` type.
2. Can't use `any` type.
3. Can't use console.log instead you need to use logger.
4. You need to assign a type to every variable even parameters in function.

## Scripts

### Generate Environment Variables

These scripts are used to generate `.env` and `secrets.env` files based on the provided JSON files.

```jsonc
// Generates .env and secrets.env files based on data/environment.json and data/secrets.json
"create-env": "tsc --project ./scripts/tsconfig.json && node scripts/create-env.js ./ false true",
"create-env:overwrite": "tsc --project ./scripts/tsconfig.json && node scripts/create-env.js ./ true true",
```

You can also run the create-env script directly if you follow the steps below:

1. Build the scripts directory using `npm run build:scripts`.
2. Run the script with `node scripts/create-env.js ./ false true` to generate `.env` and `secrets.env` files.

#### Info

1. First parameter is the path where the `.env` and `secrets.env` files will be created.
2. Second parameter is a boolean value that indicates whether to overwrite the existing files or not.
3. Third parameter is a boolean value that indicates whether to use sample values from the JSON files or not.

### Build Scripts

These scripts compile TypeScript files into JavaScript or clean build artifacts.

```jsonc
// Compiles main TypeScript sources
"build:main": "tsc --project tsconfig.json",
// Compiles scripts in the scripts directory
"build:scripts": "tsc --project scripts/tsconfig.json",
// Compiles test files in the tests directory
"build:tests": "tsc --project tests/tsconfig.json",
// Runs all builds in parallel with colored output (blue=main, magenta=scripts, cyan=tests)
"build:all": "concurrently -n 'main,scripts,tests' -c 'blue,magenta,cyan' 'npm run build:main && echo [main] Build complete (blue)' 'npm run build:scripts && echo [scripts] Build complete (magenta)' 'npm run build:tests && echo [tests] Build complete (cyan)'",
// Default build (main only)
"build": "npm run build:main",
// Removes all build files used only if user want to clean build artifacts
"clean:build": "npm run build:scripts && node scripts/clean-build.js"
```

### Linting, Formatting, and Type Checking Scripts

Scripts for code quality, formatting, and type checking.

```jsonc
// Lints all TypeScript files
"lint": "eslint . --ext .ts",
// Formats code using Prettier
"pretty": "prettier --write .",
// Checks TypeScript types without emitting files (emitting means generating .js files)
"typecheck": "tsc --noEmit"
```

### Testing Scripts

Scripts for running and checking tests.

```jsonc
// Checks for test files after building scripts
// Used by CI pipeline to ensure test for each files exists and file for each test exists
"tests:checkforfiles": "npm run build:scripts && npx wait-on scripts/check-tests.js && node scripts/check-tests.js",
// Builds tests and main, then runs Jest
"tests": "concurrently 'npm run build:tests' 'npm run build:main' && jest --config jest.config.js"
```

### Development and Start Scripts

Scripts for development mode with live reloading and starting the app.

```jsonc
// Runs all builds in watch mode and starts the server with live reload (colors: blue=main, magenta=scripts, cyan=tests, green=server)
"dev": "concurrently -n 'main,scripts,tests,server' -c 'blue,magenta,cyan,green' 'tsc --watch --project tsconfig.json' 'tsc --watch --project ./scripts/tsconfig.json' 'tsc --watch --project ./tests/tsconfig.json' 'nodemon dist/server.js'",
// Starts the app from the built output
"start": "node dist/index.js"
```

## TODO

- [ ] Configure Jest
   - [ ] Jest should use build files from `dist` directory
   - [ ] The process will be first build `tests` and `project files` then run `jest` command
   - [ ] Jest tests will be present in the `tests` directory directly where the .ts files are located whereas project files are built in the `dist` directory so be careful about the relative paths.
- [ ] absolute path support
   - [ ] Make sure that only absolute paths are used in the project, this will be done by configuring `tsconfig.json` and `eslint` to use absolute paths.
- [ ] Make a good CI pipeline
   - [ ] First step will be to run `tests:checkforfiles` script to ensure all test files exist for each source file and vice versa.
   - [ ] Second is to typecheck the project using `typecheck` script.
   - [ ] Third is to run `lint` script.
   - [ ] Then prettier
   - [ ] Then run jest tests
   - Even if one of these steps fails the pipeline should fail and merge is failed
- [ ] Commit checks
   - [ ] Add husky to run `lint`, `typecheck`, and `tests:checkforfiles` scripts before commit (Maybe not important for now as that would hinder development speed)
   - [ ] Make sure that commit messages are done in `git commit -m "type" -m "message"` format, this will be checked using maybe `commitlint` or custom script
- [ ] Environment Variable setup
   - [x] The project will by default use `.env` file for environment variables
   - [ ] If `.env` file has `NODE_ENV` variable, it will be used to determine the next `.${NODE_ENV}.env` file to load
   - [x] Make a script that creates `.env` and `secrets.env` files based on the `data/environment.json` and `data/secrets.json` files

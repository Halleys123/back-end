# Back-end Template

## Used Technologies

-  Node.js
-  TypeScript
-  Express.js
-  Jest
-  ESLint
-  Prettier
-  Docker

## Planned Technologies

-  Husky
-  MongoDB
-  Mongoose
-  Swagger
-  Kubernetes
-  Redis

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
3. You need to assign a type to every variable even parametes in function.

## Scripts

### Build Scripts

These scripts compile TypeScript files into JavaScript.

```json
"build:main": "tsc --project tsconfig.json",
"build:scripts": "tsc --project scripts/tsconfig.json",
"build:tests": "tsc --project tests/tsconfig.json",
"build:all": "npm run build:main && npm run build:scripts && npm run build:tests",
"build": "npm run build:main",
```

### Linting, Formatting, and Testing Scripts

Scripts for code quality, formatting, and running tests.

```json
"test": "npm run build:tests && npm run lint && npm run build:main && jest --config tests/jest.config.js",
"lint": "eslint . --ext .ts",
"pretty": "prettier --write .",
"typecheck": "tsc --noEmit",
```

### Development and Start Scripts

Scripts for development mode with live reloading and starting the app.

```json
"dev": "concurrently \"tsc --watch --project tsconfig.json\" \"tsc --watch --project scripts/tsconfig.json\" \"nodemon dist/index.js\"",
"start": "node dist/index.js"
```

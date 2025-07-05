FROM node:23-alpine AS base

WORKDIR /app

COPY ./package.json .
RUN npm install

COPY . .

# You can't build the image unless you follow the rules: 
RUN npm run pretty
# typescript rules that are defined for each folder root, scripts and tests
RUN npm run typecheck
# Linting rules
RUN npm run lint

# If you don't have test files for each file
# RUN npm run tests:checkforfiles
# If any of the test fails
# RUN npm run tests

FROM node:23-alpine

WORKDIR /app

COPY ./package.json .
RUN npm install --omit=dev

COPY --from=0 /app/dist .

EXPOSE 3000

CMD [ "npm", "run", "start:docker" ]
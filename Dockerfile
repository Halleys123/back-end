FROM node:23-alpine AS base

WORKDIR /app

COPY ./package.json .
RUN npm install

COPY . .
RUN npm run build

FROM alpine:3.19

RUN apk add --no-cache nodejs npm

WORKDIR /app

COPY ./package.json .
RUN npm install --omit=dev

COPY --from=0 /app/dist .

EXPOSE 3000
VOLUME /app/logs

# start:docker script was used because the default location of server.js changed from /app/dist/server.js to /app/server.js in final build
CMD [ "npm", "run", "start:docker" ]

# 1
# docker build -t arnavchhabra/backend-template --build-arg RUN_CHECKS=false .

# 2
# docker run -d --rm --name backend-template -p 3000:3000 --volume D:/logs:/app/logs  arnavchhabra/backend-template
# or
# docker run -d --rm --name backend-template -p 3000:3000 --mount type=bind,src="D:/logs",dst=/app/logs arnavchhabra/backend-template
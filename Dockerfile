FROM alpine:3.19 AS base

WORKDIR /app

COPY ./package.json .
RUN npm install

COPY . .

ARG RUN_CHECKS=true

# You can't build the image unless you follow the rules: 
# typescript rules that are defined for each folder root, scripts and tests
# Linting rules
RUN if [ "$RUN_CHECKS" = "true" ]; then \
      npm run pretty && \
      npm run typecheck && \
      npm run lint; \
    else \
      echo "Skipping pretty, typecheck, and lint"; \
    fi

# If you don't have test files for each file
# If any of the test fails
RUN if [ "$RUN_CHECKS" = "true" ]; then \
      npm run tests:checkforfiles && \
      npm run tests; \
    else \
      echo "Skipping tests"; \
    fi


FROM alpine:3.19

RUN apk add --no-cache nodejs npm

WORKDIR /app

COPY ./package.json .
RUN npm install --omit=dev

COPY --from=0 /app/dist .

EXPOSE 3000
VOLUME /app/logs

CMD [ "npm", "run", "start:docker" ]

# 1
# docker build -t arnavchhabra/backend-template .

# 2
# docker run -d --rm --name backend-template -p 3000:3000 arnavchhabra/backend-template --volume D:/logs:/app/logs
# or
# docker run -d --rm --name backend-template -p 3000:3000 --mount type=bind,src="D:/logs",dst=/app/logs arnavchhabra/backend-template
FROM node:16-alpine

ARG GIT_REF="local_build"

LABEL authors="martin.todorov@kinsend.io"

RUN set -x \
 && apk add --no-cache bash curl zip unzip mc htop tree jq \
 && mkdir -p /app

COPY ./src/ /app/src/
COPY ./*.json /app/
COPY ./*.js /app/
COPY ./*.prettierrc /app/
COPY ./*.lock /app/

WORKDIR /app

RUN set -x && \
    npm install

EXPOSE 3000/tcp

ENTRYPOINT [ "npm", "run", "start:dev" ]


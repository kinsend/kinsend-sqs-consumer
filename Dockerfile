FROM node:16-alpine

ARG MANIFEST_VERSION="local_build"

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

RUN set -x  \
 && npm install \
 && [[ ! -f /tmp/test.json ]] && echo "{}" > /app/build-manifest.json \
 && /bin/bash -c "set -xe;cat <<< \$(jq -r '. |= . + { \"git_ref\": \"$MANIFEST_VERSION\" }' /app/build-manifest.json) > /app/build-manifest.json" \
 && cat /app/build-manifest.json

EXPOSE 3000/tcp

ENTRYPOINT [ "npm", "run", "start:dev" ]

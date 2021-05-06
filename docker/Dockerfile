FROM alpine:3.12

LABEL maintainer="Marcin Polak <mapoart@gmail.com>"
WORKDIR /nexssCli

RUN apk --no-cache add git nodejs
RUN git clone https://github.com/nexssp/cli /nexssCli && npm install -g && nexss
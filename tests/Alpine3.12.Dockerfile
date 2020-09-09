FROM alpine:3.12

RUN apk add --update --no-cache \
    nodejs npm git bash

ADD . /usr/src/
WORKDIR /usr/src/

RUN npm install -y @nexssp/cli -g
RUN nexss
CMD ["/bin/bash"]
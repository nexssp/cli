FROM node:17-alpine3.14

RUN apk add --update --no-cache nodejs npm

CMD ["/bin/sh"]
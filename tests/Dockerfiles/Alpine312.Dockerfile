FROM alpine:3.12

RUN apk add --update --no-cache nodejs npm

CMD ["/bin/sh"]
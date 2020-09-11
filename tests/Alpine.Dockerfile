FROM alpine

RUN apk add --update --no-cache \
    nodejs npm git bash

CMD ["/bin/bash"]
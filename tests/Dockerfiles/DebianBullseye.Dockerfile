FROM debian:bullseye

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && \
    apt-get install -y --force-yes \
    curl \
    apt-transport-https \
    lsb-release \
    build-essential \
    python-all

RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -
RUN apt-get update
RUN apt-get install git nodejs -y --force-yes

ENV DEBIAN_FRONTEND=interactive

CMD ["/bin/bash"]
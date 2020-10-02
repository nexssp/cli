FROM debian:buster

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && \
    apt-get install -y \
    curl \
    apt-transport-https \
    lsb-release \
    build-essential \
    python-all

RUN curl -sL https://deb.nodesource.com/setup_14.x | bash - && \
    apt-get update && \
    apt-get install git nodejs -y

ENV DEBIAN_FRONTEND=interactive

CMD ["/bin/bash"]
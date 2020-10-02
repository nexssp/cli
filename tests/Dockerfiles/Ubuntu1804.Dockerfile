FROM ubuntu:18.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt update && \
    apt install -y \
    curl \
    apt-transport-https \
    lsb-release \
    build-essential \
    python-all

RUN curl -sL https://deb.nodesource.com/setup_14.x | bash - && \
    apt update && \
    apt install git nodejs -y

ENV DEBIAN_FRONTEND=interactive

CMD ["/bin/bash"]
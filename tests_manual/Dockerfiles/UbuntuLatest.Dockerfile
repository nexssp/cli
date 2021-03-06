FROM ubuntu:latest

RUN apt-get update && \
    apt-get install -y --force-yes \
    curl \
    apt-transport-https \
    lsb-release \
    build-essential \
    python-all

RUN curl -sL https://deb.nodesource.com/setup | bash -
RUN apt-get update
RUN apt-get install git nodejs -y --force-yes

CMD ["/bin/bash"]
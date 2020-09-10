FROM Fedora:latest

RUN dnf update

# optional 
RUN dnf install -y gcc-c++ make
RUN dnf update -y && \
    dnf install -y findutils && \
    dnf clean all

RUN curl -sL https://rpm.nodesource.com/setup_14.x | bash -
RUN dnf install nodejs npm -y --force-yes

ADD . /usr/src/
WORKDIR /usr/src/

# which is needed
RUN dnf install -y which procps
RUN npm install -y @nexss/cli -g
CMD ["nexss", "test","all"]
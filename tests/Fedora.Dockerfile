FROM Fedora:latest

RUN dnf update

# optional 
RUN dnf install -y gcc-c++ make
RUN dnf update -y && \
    dnf install -y findutils && \
    dnf clean all

RUN curl -sL https://rpm.nodesource.com/setup_14.x | bash -
RUN dnf install nodejs npm -y --force-yes

# required for Nexss Programmer
RUN dnf install -y procps

CMD ["/bin/bash"]
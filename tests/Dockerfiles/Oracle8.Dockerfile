FROM oraclelinux:8

RUN dnf install -y git
RUN curl -sL https://rpm.nodesource.com/setup_14.x | bash -
RUN dnf install -y nodejs

CMD ["/bin/bash"]
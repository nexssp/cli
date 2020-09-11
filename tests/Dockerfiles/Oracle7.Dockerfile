FROM oraclelinux:7

RUN curl -sL https://rpm.nodesource.com/setup_14.x | bash -
RUN yum install -y nodejs 

CMD ["/bin/bash"]
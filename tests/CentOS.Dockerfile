FROM centos:latest

RUN yum update

# optional 
RUN yum install -y gcc-c++ make

RUN curl -sL https://rpm.nodesource.com/setup_14.x | bash -
RUN yum install nodejs npm -y --force-yes

ADD . /usr/src/
WORKDIR /usr/src/

# which is needed
RUN yum install which
RUN npm install -y @nexss/cli -g
CMD ["nexss", "test","all"]
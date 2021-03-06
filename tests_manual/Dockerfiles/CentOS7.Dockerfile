FROM centos:7
# optional 
RUN yum install -y gcc-c++ make 
# required
RUN yum install -y git

RUN curl -sL https://rpm.nodesource.com/setup_14.x | bash -
RUN yum install -y nodejs

CMD ["/bin/bash"]
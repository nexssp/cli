FROM centos
# optional 
RUN yum install -y gcc-c++ make 
# required
RUN yum install -y which git

RUN curl -sL https://rpm.nodesource.com/setup_14.x | bash -
RUN yum install -y nodejs

CMD ["/bin/bash"]
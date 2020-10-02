FROM amazonlinux:latest

RUN yum install -y git 
RUN curl -sL https://rpm.nodesource.com/setup_14.x | bash - && yum update -y && yum install -y nodejs 

# YARN
# curl -sL https://dl.yarnpkg.com/rpm/yarn.repo | sudo tee /etc/yum.repos.d/yarn.repo
# sudo yum -y install yarn

CMD ["/bin/bash"]
FROM fedora:31

RUN curl -sL https://rpm.nodesource.com/setup_14.x | bash -
RUN dnf install nodejs git -y

# required for Nexss Programmer
RUN dnf install -y procps

CMD ["/bin/bash"]
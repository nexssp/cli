FROM opensuse/leap

RUN curl -sL https://deb.nodesource.com/setup | bash -
RUN apt-get update
RUN apt-get install git nodejs -y --force-yes

CMD ["/bin/bash"]
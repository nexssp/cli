FROM fedora:21

RUN curl -sL https://rpm.nodesource.com/setup_14.x | bash -
RUN dnf install nodejs -y

CMD ["/bin/sh"]
FROM fedora:34

RUN dnf install nodejs -y

CMD ["/bin/sh"]
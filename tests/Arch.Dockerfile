FROM archlinux

RUN pacman -Sy --noconfirm git nodejs npm which

ADD . /usr/src/
WORKDIR /usr/src/

RUN npm install -y @nexss/cli -g
RUN nexss
CMD ["nexss", "test","all"]
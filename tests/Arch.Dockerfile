FROM archlinux

RUN pacman -Sy --noconfirm git nodejs npm which

ADD . /usr/src/
WORKDIR /usr/src/

RUN npm install @nexssp/cli -g
RUN nexss
RUN nexss l u

# CMD ["nexss", "test","all"]
CMD ["/bin/bash"]
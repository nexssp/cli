FROM archlinux

RUN pacman -Sy --noconfirm git nodejs npm

CMD ["/bin/bash"]
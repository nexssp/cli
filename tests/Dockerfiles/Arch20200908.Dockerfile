FROM archlinux:20200908

RUN pacman -Sy --noconfirm nodejs npm

CMD ["/bin/bash"]
FROM archlinux:latest

RUN pacman -Sy --noconfirm git nodejs npm
RUN pacman -Sy binutils fakeroot sudo --noconfirm --needed
RUN useradd non_root && mkdir /home/non_root && chown -R non_root:non_root /home/non_root
RUN echo 'non_root ALL=NOPASSWD: ALL' >> /etc/sudoers
USER non_root
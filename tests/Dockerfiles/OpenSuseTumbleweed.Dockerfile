FROM opensuse/tumbleweed

RUN zypper -n install curl tar gzip git
RUN zypper -n in nodejs npm

# export PATH="$HOME/.yarn/bin:$HOME/.config/yarn/global/node_modules/.bin:$PATH"
CMD ["/bin/bash"]
FROM opensuse/leap

RUN zypper -n install curl tar gzip nodejs12 git

CMD ["/bin/bash"]
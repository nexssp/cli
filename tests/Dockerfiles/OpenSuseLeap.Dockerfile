FROM opensuse/leap

# RUN zypper -n ar http://download.opensuse.org/repositories/devel:/languages:/nodejs/openSUSE_Leap_42.1/ Devel:Languages:NodeJS
# RUN zypper -n --gpg-auto-import-keys ref Devel:Languages:NodeJS

# RUN zypper -n in patterns-openSUSE-devel_C_C++ gcc-c++

# RUN zypper -n in npm

RUN zypper -n install curl tar gzip 
# export PATH="$HOME/.yarn/bin:$HOME/.config/yarn/global/node_modules/.bin:$PATH"
CMD ["/bin/bash"]
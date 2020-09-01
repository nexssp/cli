# Nexss Programmer Linux Installer
InstallPath=~/.nexss/nexssCli
git clone --depth=1 https://github.com/nexssp/cli.git $InstallPath
echo Adding $InstallPath to your PATH
if ! grep "~/.nexss/nexssCli" ~/.bashrc &> /dev/null ; then
    echo export PATH=~/.nexss/nexssCli:$PATH > ~/.bashrc
endif
export PATH=~/.nexss/nexssCli:$PATH
nexss
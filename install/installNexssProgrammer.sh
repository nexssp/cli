# Nexss Programmer Linux Installer
InstallPath=~/.nexss/nexssCli
if test -f "$FILE"; then
    git clone --depth=1 https://github.com/nexssp/cli.git $InstallPath
    echo Adding $InstallPath to your PATH
    if ! grep "~/.nexss/nexssCli" ~/.bashrc &> /dev/null ; then
        echo export PATH=~/.nexss/nexssCli:$PATH > ~/.bashrc
    fi
    export PATH=~/.nexss/nexssCli:$PATH
    # Below pm replace to match your linux distribution
    sudo apt install nodejs -y
    # First start + install packages
    nexss
else
    echo $InstallPath already exists (Nexss Programmer is installed)
    echo to update it there see 'nexss --update'
    echo or you can delete $InstallPath and start installer again
fi
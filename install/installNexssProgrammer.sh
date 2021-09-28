# Nexss Programmer Linux Installer
InstallPath=~/.nexss/nexssCli
if ! test -f "$InstallPath"; then
    git clone --depth=1 https://github.com/nexssp/cli.git $InstallPath
    echo Adding $InstallPath to your PATH
    if ! grep "~/.nexss/nexssCli" ~/.bashrc &> /dev/null ; then
        echo export PATH=~/.nexss/nexssCli:$PATH > ~/.bashrc
    fi
    export PATH=~/.nexss/nexssCli:$PATH
    # Below pm replace to match your linux distribution

    if ! command -v node &> /dev/null
    then
        curl -sL https://deb.nodesource.com/setup_14.x | sudo bash -
        sudo apt update
        sudo apt -y install nodejs npm gcc g++ make
    else
        echo Nodejs is installed
        node -v
        echo NPM
        npm -v
    fi   
    # First start + install packages
    nexss
else
    echo $InstallPath already exists - Nexss Programmer is installed
    echo to update it there see 'nexss --update'
    echo or you can delete $InstallPath and start installer again
fi
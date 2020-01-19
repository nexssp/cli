# Nexss Programmer Installator
# Author: Marcin Polak <mapoart@gmail.com>
# Scoop, NodeJS lts, git, Nexss Programmer

Write-Host "Welcome to the Nexss Programmer 2.0 Installer" -ForegroundColor Yellow
Write-Host "It will install Scoop, Node.js, git and Nexss Programmer." -ForegroundColor Yellow

# =====================
$currentDir = (Get-Location).Path
$homeDir = (Get-PsProvider 'FileSystem').home

$scoopInstallPath = "$($homeDir)\scoop";
$nexssProgrammerInstallPath = "$($homeDir)\.nexssCli"

$archType = 32;
if ([System.Environment]::Is64BitOperatingSystem) {
    $archType = 64;
}

$powershellVersionMajor = $PSVersionTable.PSVersion.Major
$powershellVersionMinor = $PSVersionTable.PSVersion.Minor

$windowsMajorVersion = [System.Environment]::OSVersion.Version.Major
$windowsMinorVersion = [System.Environment]::OSVersion.Version.Minor
Write-Host "You are on Windows $windowsMajorVersion.$windowsMinorVersion $archType-Bit"
Write-Host "You have PowerShell version $powershellVersionMajor.$powershellVersionMinor"

if ($windowsMajorVersion -lt 10) {
    if (($PSVersionTable.PSVersion.Major) -lt 5) { 
        Write-Output "You are using older version of Windows."
        Write-Output "You need to have installed Powershell at least version 5. For more information please go to:"
        Write-Output "https://github.com/nexssp/cli/wiki/Windows-7-or-8"
        exit
    }
}

$confirmation = Read-Host "Would you like to continue? [y/n]"
while ($confirmation -ne "y") {
    if ($confirmation -eq 'n') { exit }
    $confirmation = Read-Host "Would you like to continue? [y/n]"
}

# This is needed to get the Scoop working
# more here: https://scoop.sh/
# Install Scoop



# Derived from Scoop Installator
# https://raw.githubusercontent.com/lukesampson/scoop/master/bin/install.ps1
if (($PSVersionTable.PSVersion.Major) -lt 5) {
    Write-Output "PowerShell 5 or later is required to run Scoop."
    Write-Output "Upgrade PowerShell: https://docs.microsoft.com/en-gb/powershell/scripting/install/installing-powershell-core-on-windows?view=powershell-7"
    
    # msiexec.exe /package PowerShell-<version>-win-<os-arch>.msi /quiet ADD_EXPLORER_CONTEXT_MENU_OPENPOWERSHELL=1 ENABLE_PSREMOTING=1 REGISTER_MANIFEST=1
    
    break
}

# show notification to change execution policy:
$allowedExecutionPolicy = @('Unrestricted', 'RemoteSigned', 'ByPass')
if ((Get-ExecutionPolicy).ToString() -notin $allowedExecutionPolicy) {
    Write-Output "PowerShell requires an execution policy in [$($allowedExecutionPolicy -join ", ")] to run Scoop."
    Write-Output "For example, to set the execution policy to 'RemoteSigned' please run :"
    Write-Output "'Set-ExecutionPolicy RemoteSigned -scope CurrentUser'"
    break
}

if ([System.Enum]::GetNames([System.Net.SecurityProtocolType]) -notcontains 'Tls12') {
    Write-Output "Scoop requires at least .NET Framework 4.5"
    Write-Output "Please download and install it first:"
    Write-Output "https://www.microsoft.com/net/download"
    break
}

# Check scoop installation
Write-Output "Checking Scoop.."
if (!(Get-Command scoop -errorAction SilentlyContinue)) {
    if ( Test-Path $scoopInstallPath) {    
        Write-Host "'scoop' command does not seem to work however you have directory $scoopInstallPath (Old installation?)" -ForegroundColor Green
        Write-Host "This will not install scoop if you don't remove it first." -ForegroundColor Red
        Write-Host "You may need to fix it manually, but to continue you need to delete it first" -ForegroundColor Yellow
        Write-Host "Do you want to delete scoop install dirctory $scoopInstallPath ? [y/n] " -NoNewline -ForegroundColor Yellow
        $confirmation = Read-Host 
        while ($confirmation -ne "y") {
            if ($confirmation -eq 'n') { exit }
            Write-Host "Do you want to delete scoop install dirctory $scoopInstallPath ? [y/n] " -NoNewline -ForegroundColor Red
            $confirmation = Read-Host 
        }
        Write-Host "Removing $scoopInstallPath.. This may take a while (depends on size).. Please wait.." -ForegroundColor Yellow
        # Remove-Item -Path $scoopInstallPath -Recurse -Force 
        rm -r -fo $scoopInstallPath
    }
    Invoke-WebRequest -useb get.scoop.sh | Invoke-Expression # Installs Scoop Package Manager
}
scoop update
scoop bucket add extras

# Install NodeJS (Long Term Support) and git
scoop install nodejs-lts git

# You need to be in the directory with write permission.
# for example: Your home directory **c:\Users\YourNickname\**)

Write-Host "Installing Nexss Programmer 2.0.."
if ((!(Get-Command nexss -errorAction SilentlyContinue)) -or (!(Test-Path $nexssProgrammerInstallPath))) {
    if ( Test-Path $nexssProgrammerInstallPath) {        
        Write-Host "Nexss Programmer is installed however nexss command does not work." -ForegroundColor Yellow
        Write-Host "Do you want reinstall Nexss Programmer $nexssProgrammerInstallPath (all old version data will be deleted - ONLY CLI, PACKAGES ARE NOT DELETED!) ? [y/n] " -NoNewline -ForegroundColor Yellow
        $confirmation = Read-Host 
        while ($confirmation -ne "y") {
            if ($confirmation -eq 'n') { exit }
            Write-Host "Do you want reinstall Nexss Programmer $nexssProgrammerInstallPath (all old version data will be deleted - ONLY CLI, PACKAGES ARE NOT DELETED!) ? [y/n] " -NoNewline -ForegroundColor Red
            $confirmation = Read-Host 
        }
        Write-Host "Removing $nexssProgrammerInstallPath.. Please wait.." -ForegroundColor Yellow
        # Remove-Item -Path $scoopInstallPath -Recurse -Force 
        rm -r -fo $nexssProgrammerInstallPath
    }

    git clone --recurse-submodules https://github.com/nexssp/cli.git "$nexssProgrammerInstallPath"
    Set-Location "$nexssProgrammerInstallPath"
    npm link
    Set-Location ..
    nexss
}
else {
    Write-Host "Nexss Programmer is already installed." -ForegroundColor Green
}
# If there was some changes to the directory, now we are back to the same one.
Set-Location $currentDir


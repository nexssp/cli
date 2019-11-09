# Nexss PROGRAMMER 2.0

## How to start learning computer programming?

- Start PROGRAMMING within minutes with Nexss PROGRAMMER 2.0 eg. `nexss myprogram.r` OR `nexss myanotherprogram.py` and will download automatically compiler and run Your program,
- Save time by using as many languages you like for the solution,
- At the moment **28 programming languages** can be used in one project (and increasing) with provided templates for each language,
- Predefined/customisable solutions (nexss allow to predefine solutions for errors to fix them quickly),
- Configurable Error handling with suggested solutions,
- Easy to develop reusable modules and code.

**SAVE TIME** on learning any programming language with NEXSS PROGRAMMER.

NOTE: **Java**, **Scala**, **C**, **C#**, **Haskell**, **VBScript**, **Windows Scripting Hosts**, **PureData** need some manual adjustments to make to work (languages related).

NOTE2: **Linux** _(Soon)_ and **MacOS** _(Soon)_ - **Work In Progress**

## Introduction

**Nexss PROGRAMMER** allows you to run code in many languages (together or separately) EASY and SAVES A LOT OF TIME.

## Video Tutorials (WIP)

[25 programming languages in the Nexss Programmer 2.0](https://youtu.be/u5up3eRjWto)  
[How to compile your program EASY](https://youtu.be/zdgEM26VOOw)  
[Easy Programming - How to compile multiple languages FAST & EASY](https://youtu.be/YZGPPTRLjZk)

## WHY

- You can start programming in minutes,
- You can combine now **as many languages you want** easy eg for prototyping
- You can use libraries which was written on old machines and combine with modern solutions
- Save time on written automation tools **by you**!
- Write reusable modules **EASY** in as many languages you like.

Please go to the [USER_HOME_PATH]/.nexss/packages folder to grasp the idea. There are examples of the modules you can use.

## Nexss PROGRAMMER Examples

**[USER_HOME_PATH]/.nexss/packages** or `nexss pkg list`

## Installation & First Run

### Installation

**For beginners**: Please install [Git](https://git-scm.com/) and [NodeJS v12](https://nodejs.org/) first.

**WINDOWS USERS:** Nexss Programmer is using Scoop for installing language related compilers, builders etc. If you have issues with older system(s) please use **Powershell** with Powershell Core and .NET Framework 4.5. More inforamtion please see:
[Scoop Website](https://scoop.sh/) or [Scoop Quick Start](https://github.com/lukesampson/scoop/wiki/Quick-Start)

**notice:** if you have an issue like: "execution of this script is disabled" OR "get-help about_signig" you may want to run **`Set-ExecutionPolicy RemoteSigned -scope CurrentUser`** on your **PowerShell** terminal.

```sh
git clone --recurse-submodules -j8 https://github.com/nexssp/cli.git
cd cli
npm install
npm link
cd ..
# npm i nexss -g # WIP/SOON
```

### New Project

**Nexss PROGRAMMER** will be installed in the global scope so you can run it from anyplace in the system.

```sh
nexss project new myproject # or nexss p new myproject
cd myproject
nexss start # or nexss s      - run the project
nexss s --server # if you have specified server, this will start the server
nexss s --verbose # this will display all extra information during run
nexss project info # or nexss p i    - display info about project

# Packages (nexss packages)
nexss pkg list --json # list of available packages
nexss pkg l ocr --json # Search for OCR packages with json output
nexss package list video # List Video related packages

# Add Packages/Actions
# Adds Show Desktop to the package
nexss pkg add Keyboard --type="#d" --copyPackage --saveNexss  --forceNexss

# Specific language commands
nexss js # display all available specific language commands
nexss js pm # displays package managers available for JavaScript/NodeJS (select your language).
nexss js compilers # displays compilers
nexss js errors # displays errors and supports available for particular language and

# Config (nexss config)
nexss config get --json
nexss config get --select sequences
nexss config get --configPath c:/Users/mapoart/.nexss/packages/Demos/Start --select sequences
```

## Packages Examples

```sh
nexss Id # returns id
nexss Id --fields=cuid
nexss Blender
nexss Clipboard # receive clipboard value nexss Clipboard help for more
nexss Convert/VideoToGif --file=myfile.mp4
nexss Input/OCR --file=myimage.jpg
nexss Keyboard --type="#s" # WIN + s
nexss Keyboard --type="#d" # WIN + d / Show Desktop
nexss Keyboard --type="#b" # WIN + b / Show Taskbar
nexss Mouse/Move --x=1 --y=20
nexss Mouse/MoveToImage --image=1
nexss Nexss/PackageBrowser
nexss Select/Area
nexss Screen/Capture --file=123123.png # OR as below PIPE
echo {"file":"myfile.jpg"} | nexss Mouse/MoveToImage
```

## Project structure

```txt
/
win32/ - platform specific for Windows
darwin/ - platform specific for MacOS
linux/ - platform specific for Linux
src/ - main source for all platforms if platform folder does not exist

\_nexss.yml - file with the configuration for src. Each platform specific has own configuration
\config.env - optional environment variable file
```

note: you can create platform specific code just to create new project inside the folder eg `nexss p new win32`

## Environment variables

```env
<!-- config.env -->
MYENV1=myvar
```

### Tutorials

### Config file

```yaml
# name: this is name of the project
# debug:
# input: global input - first data, like parameters
# data: ???
# build: 3 types of values undefined (default is build for all), true, false
files:
  - data:
  x: 1000
  y: 1000
  - name: file1.js
    build: true
  - name: file2.r trala --blue sky
    disabled: true
    build: false #the same as global undefined, not needed.
    cache: 20s # will be cached by 20 seconds
  - name: anotherfile.pl
    args: z
      55
```

## Installing Packages

```sh
nexss js install nanomsg # if npm is not initialized it will automatically initialize the project
nexss js # displays commands for package panager for in this case JavaScript
nexss php install zeromq
```

## Files

```sh
nexss file list
nexss file add
nexss file add myfile --template notdefault.js
```

When file has additonal file like abc.ahk has abc.ahk.js extra operations will be performed like: files - copy files, commands execure commands.

```js
// additional info for templates like copy extra libraries.
// in this case library needs JSONParser.ahk so lets specify it.
const config = {
  files: ["3rdPartyLibraries/JSONParser.ahk"],
  commands: ["ls -la"]
};

module.exports = config;
```

### You can use example as the template for your new project

**--template** or **-t** to use template from folder examples or templates

```sh
nexss project create myproject --template examples/automation-1 -f
```

### Commands (like npm scripts)

```sh
nexss command add directorylist ls -la # nexss command add [name] [...command]
nexss c add mycommand ls -la # also aliast is c
nexss c add executeNexssBegin nexss s nexssBegin.js # execute nexss statement through command
nexss c list # list of commands in the actual project
nexss c delete #it will display selection of commands to delete one.
```

### Stdin

```ps1
echo {"works":"1"} | nexss start default.php
```

### Errors

Nexss PROGRAMMER parsing also compiler outputs to show possible solutions to the issue you may come up. You can also configure your own error parsers (regexp or string) in the \_nexss.yml config file eg:

```yml
errors:
  "address already in use :::(.*?)\r\n":
    all: "Find process and kill it by: nexss ps find port <found1> && nexss ps stop <founded pid>"
```

You can use `all`, but also `win32`, `linux`,`darwin` accordingly.

## Languages Supported

To check if the language is supported, just write `nexss myfile.js` and then you will n

### Language specific commands

For all languages

`nexss js compilers`
`nexss py builders`
`nexss tcl pm` Or `nexss tcl packageManagers`
`nexss js errors`

For specific language

`nexss js`
`nexss py`
`nexss rust`
`nexss java`
`nexss tcl`
`nexss php`

## Debuging and Development

```sh
nexss myfile.pl --verbose # will display extra information during run, best to use it on one file as it may couse sequences and clasters not working properly on stdin/stdout channels
```

## Processes

You can manage processes from nexss by commands

```sh
nexss ps # list of processes
nexss ps clean # removes stopped processes from the queue
nexss ps stop 1234 # stop process (windows kill as there is only emulation) with id (you can kill any process you like on OS. Be careful)
```

### Known Issues

When you use nexss PROGRAMMER project, there is an issue with execute file in the src/ folder. It will not work: nexss file.php, you need to run it from main folder eg. nexss src/file.php

## Useful links

For Stdin, Stdout, Stderr in Nexss PROGRAMMER is JSON for default templates however you can use the format as you like XML, etc.
(http://json.org/) - Examples of many implementations of JSON

## Troubleshooting

### Powershell Issues

if you have an issue like: "execution of this script is disabled" OR "get-help about_signig" you may want to run **`Set-ExecutionPolicy RemoteSigned -scope CurrentUser`** on your **PowerShell** terminal.

### Connection

if you have an issue like: "execution of this script is disabled" OR "get-help about_signig" you may want to run **`Set-ExecutionPolicy RemoteSigned -scope CurrentUser`** on your **PowerShell** terminal.

## Future

We are working now on the Graphical User Interface and many improvements so package can be use not only by programmers. We are working hard to get it ready in November 2019.

### TODO List

- MacOS finish implementation (packages, configurations for all languages) **Work in progress**
- Linux finish implementation (packages, configurations for all languages) **Work in progress**
- More Packages related to the current needs
-
- Write Automatic Tests

## Donate [![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=RP72WY9S6CM4L&source=url)

It is a great pleasure to work on the tools for everyone however the donations are always part of motivation which helps to move forward. There is still a lot of work to implement this on the **Linux** and **MacOS**.

Please consider donating to the Nexss Paypal Account [![paypal](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=RP72WY9S6CM4L&source=url) [![Donate](nexss_kod_qr.png)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=RP72WY9S6CM4L&source=url)

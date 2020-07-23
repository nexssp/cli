```sh
Welcome to      ____
|..          | |             ``..      ..''             ..''''             ..''''
|  ``..      | |______           ``..''              .''                .''
|      ``..  | |                 ..'`..           ..'                ..'
|          ``| |___________  ..''      ``.. ....''             ....''
Programmer 2.1.2 - Free, Open Source, Educational Version
```

<p align="center">
<b><a href="https://github.com/nexssp/cli/wiki/Concept-Overview">Overview</a></b> |
<b><a href="https://github.com/nexssp/cli/wiki/Nexss-Programmer-Programming-Languages">List of Languages</a></b> |
<b><a href="https://github.com/nexssp/cli/wiki/Quick-Start">Installation</a></b> |
<b><a href="https://github.com/nexssp/cli/wiki">Documentation</a></b> |
<b><a href="https://github.com/nexssp/cli/wiki/Tutorials">Tutorials</a></b>
</p>

---

<p align="center" >
    <a href="https://github.com/nexssp/cli/blob/master/LICENSE">
        <img src="https://img.shields.io/github/license/nexssp/cli?style=for-the-badge" alt="License" />
    </a>
    <a href="https://github.com/nexssp/cli">
        <img src="https://img.shields.io/github/languages/code-size/nexssp/cli?style=for-the-badge" alt="Repository size" />
    </a>
    <a href="https://discord.gg/d9xjMEX">
        <img src="https://img.shields.io/badge/CHAT-ON%20DISCORD-brightgreen?style=for-the-badge" alt="License" />
    </a>
</p>


## Value Propositions
- **Learning Tool** - Students can learn modern and old(history) of the languages and don't have to spend a lot of time finding out about how to install compilers - so Universities, Schools, Individuals - Self-learners etc. More people would start to like programming..
- **Speed up producing** - Add new file to work with and start from predefined templates, each language have own repo and templates folder,
- **Speed up learning** - Error/Solution - has engine which parse the errors which can be specified in the Nexss Programmer's language file configuration, so display predefined solutions for particular error,
- **Automation tool** - allows you to run programs in sequence in different programming languages and also pass variables to the next step (for now there is not implemented easy distributed solution),
Here are the main features video: https://www.youtube.com/watch?v=z5scbto_yOM
- **Nexss Programmer Projects/Packages** - One Project can run (for now in sequence) - many files or another Nexss Programmer Projects as one solution,
- **New Scripting Language** - .nexss - Users can create own commands (Nexss Programmer Packages). Each command is a Nexss Programmer package and package can be one file or many files in different languages or combination of files and packages. To create new packages is for more advanced users but .nexss is for people who just want to make solution eg in the office. Example here: AutoPrint - https://nexss.com/en/easy-install-nexss-programmer.html (This example checks your emails for pdf attachments and if any of them contains word invoice it will automatically prints it. - how much time can be saved by 10 lines script)
- **Build your own language**

### Notes
For now Nexss Programmer works on all platforms, however all languages are implemented only on Windows.

### Links
Code Repository: <https://github.com/nexssp/cli> (here)  
Documentation: <https://github.com/nexssp/cli/wiki>  
Video(3min): <https://www.youtube.com/watch?v=7WbnYyEnBNk>  
Features Video: <https://www.youtube.com/watch?v=z5scbto_yOM>  
Technologies Video: <https://www.youtube.com/watch?v=aUIcR7Qps-A>  

```sh
# Switch between Nexss Programmer versions
nexss --update master # latest version 2.1.2
nexss --update 2.1
nexss --update 2.0
```
**Nexss Programmer Presentation** (Youtube video):  
[![Nexss Programmer Presentation](https://img.youtube.com/vi/vs2tXMrZzzs/0.jpg)](https://www.youtube.com/watch?v=vs2tXMrZzzs)

NOTE: _**Nexss Programmer DOES NOT need administrative rights**_ for your operating system so it is very safe. Try it today and save your time!

Nexss Programmer is the **innovative** and **evolutionary** tool for the programmers with unlimited possibilities. This system allows to combine from almost [50 programming languages](https://github.com/nexssp/cli/wiki/Nexss-Programmer-Programming-Languages) in many different ways.

---

## Install by one line in PowerShell !

```sh
Set-ExecutionPolicy Bypass -Scope Process -Force; iwr -useb nexss.com/installProgrammer | iex
```

If you are having errors about tls/ssl channel please run first:  
`[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12`

---

NOTE2: **Linux** _(Soon - FOR NOW ONLY WORKS NODEJS)_ and **MacOS** + Swift language _(Soon)_ - **Work In Progress**

---

For installing some of the compilers **Nexss Programmer** uses fantastic package manager tool from **Luke Sampson** [SCOOP](https://scoop.sh/)

---

## How to start learning computer programming?

- Start **learning PROGRAMMING** within minutes with Nexss PROGRAMMER 2.0 eg. `nexss myprogram.r` OR `nexss myanotherprogram.py` **(nexss file.ext)** and it will download automatically compiler and run Your program.
- Add files from predefined templates for the languages
- Build your own tools that other people can use,
- Configurable Error handling with suggested solutions,
- Save time by using as many languages you like for the solution (combined),
- At the moment **32 programming languages** can be used in one project (and increasing) with provided templates for each language,
- Predefined/customisable solutions (nexss allow to predefine solutions for errors to fix them quickly),
- Easy to develop reusable modules and code.

## WHY

- You can start any program in seconds without anything,
- You can combine now **as many languages you want** easy eg for prototyping,
- You can use libraries which was written on old machines and combine with modern solutions,
- Save time on written automation tools **by you**!
- Write reusable modules **EASY** in as many languages you like.

Please go to the [USER_HOME_PATH]/.nexss/packages folder to grasp the idea. There are examples of the modules you can use.

## Nexss PROGRAMMER Examples

**[USER_HOME_PATH]/.nexss/packages** or `nexss pkg list`

Note: Packages will be installed with the very first run of `nexss` command in your terminal.

### TODO List (New Features)

- **MacOS** finish implementation (packages, configurations for all languages) **Work in progress**,
- **Linux** finish implementation (packages, configurations for all languages) **Work in progress**,
- Setup builders 'Any language To EXE' and 'Any module to EXE',
- More packages related to the current needs of the users,
- More tutorials and practical examples,
- Sequences/Applications with voice control,
- Global packages versioning, updates,
- Setup builders (Done on C++, C, Python) to make binaries (much faster ! even 1000x) + Compile Nexss PROGRAMMER packages to binary,
- Write Automatic Tests.

## Donate [![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=RP72WY9S6CM4L&source=url)

It is a great pleasure to work on the tools for everyone however it is a huge amount of work and the donations are always part of motivation which helps to move forward. There is still a lot of work to implement **Nexss PROGRAMMER** on the **Linux** and **MacOS**.

Please consider donating to the Nexss Paypal Account

[![paypal](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=RP72WY9S6CM4L&source=url) [![Donate](nexss_kod_qr.png)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=RP72WY9S6CM4L&source=url)

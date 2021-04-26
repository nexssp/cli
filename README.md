```sh
npm i @nexssp/cli -g # Or npx @nexssp/cli
nexss

Welcome to      ____
|..          | |             ``..      ..''             ..''''             ..''''
|  ``..      | |______           ``..''              .''                .''
|      ``..  | |                 ..'`..           ..'                ..'
|          ``| |___________  ..''      ``.. ....''             ....''
Programmer
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

**Nexss Programmer** is a cli tool which allows to compile, compose over **50** programming languages.

- `nexss program.r`
- `nexss program.[any extension]`
- `npx @nexssp/cli program.r` # without installing nexss
- `nexss file add my.rs --edit` # Will open list of templates for particular language, install editor (if not exists) and open file for editing.

## Run any programming language in seconds (eg. Google Colab Notebook)

```sh
!npm i -g @nexssp/cli
!nexss f a my.r --helloWorld # Add template
!nexss my.r # run program
# {"HelloFromR":"4.0.5","nexss":"2.2.35"}
!nexss Id # run Id package
# {"nxsOut":"cknvpfni00000blqefsh37hwa","nexss":"2.2.35"}
!nexss f a my.cpp --helloWorld # Add template
!nexss my.cpp
# {"outputCPP":"Hello from C++ 17!","nexss":"2.2.35"}
```

## Upgrade to the latest versions

- `nexss l u` # the same as `nexss langauge update` // Updating all installed language definitions
- `nexss pkg u` # the same as `nexss package update` // Updating all installed Nexss Programmer Packages
- `nexss cache rebuild` # rebuilding cache // handy when developing new language configurations (now is over 50)

**Nexss Programmer Presentation** (Youtube video):  
[![Nexss Programmer Presentation](https://img.youtube.com/vi/vs2tXMrZzzs/0.jpg)](https://www.youtube.com/watch?v=vs2tXMrZzzs)

## Nexss Programmer functionalities:

✔ Easy programming for _**multiplatform**_ in over 50 programming languages,  
✔ **Windows**, Linux: tested on: **Alpine**, **Amazon**, **Arch**, **CentOS**, **Debian**, **Fedora**, **Mint**, **Oracle**, **Rhel**, **Suse Leap**, **Suse TumbleWeed**, **Ubuntu** and soon **MacOS**,  
✔ **NodeJS** versions: 10+ => **10.x**, **12.x**, **14.x**, **15.x**  
✔ Over **50** programming languages: **Ada**, **Auto Hot Key**, **Autoit**, **Bash**, **Basic**, **Batch**, **C**, **Clojure**, **Coconut**, **Coffee Script**, **C++**, **Crystal**, **CSharp**, **D**, **Dart**, **Elixir**, **Erlang**, **Fortran**, **Go**, **Groovy**, **Haskell**, **Haxe**, **Hy**, **Java**, **JSON**, **Julia**, **Kotlin**, **Lua**, **Nexss**, **Nim**, **NodeJS**, **Octave**, **Perl**, **PHP**, **PowerShell**, **Pure Data**, **Python 3**, **R**, **Racket**, **Raku**, **Ruby**, **Rust**, **Scala**, **TCL/TK**, **Typescript**, **V**, **VBScript**, **Windows Scripting Host**, **Zig**

✘ WIP - Add more here later..

## Functions

- --nxsI - interactive mode

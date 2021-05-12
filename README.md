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

**NOTE:** If there is anything which doesn't work please **create [new issue](https://github.com/nexssp/cli/issues/new)** and **it will be solved immediately** as we have a lot of emails and email issues can be delayed..Thank you!

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

**Nexss Programmer** is a cli tool which allows to:

### Easy and intuitively install programming environments

Example:

- `nexss r install` OR `nexss py install` OR `nexss php install` OR ..
- `nexss [language file extension] install`

- **NEW:** easy shortcuts: `nexss py d` (creates file with default template), `nexss py h` (with helloWorld template), `nexss py e` (and empty file - if exists in the templates - !empty.[extension]) **(2.4.8+)**

### Compile, compose over **50** programming languages

if there is no compiler installed, nexss programmer will install it automatically.

- `nexss program.r`
- `nexss program.[any extension]`
- `npx @nexssp/cli program.r` # without installing nexss
- `nexss file add my.rs --edit` # Will open list of templates to select from for particular language, install editor (if not exists) and open file for editing.

### Run any programming language in seconds (eg. Google Colab Notebook)

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

### And much, much more..

- Checkout our **blog** on [nexss.com](https://nexss.com/11_blog-nexss-programmer/introduction/nexss-blog.html)
- Documentation on [nexss programmer wiki](https://nexss.com/programmer_.html)

## NOTE: Upgrade to the latest versions

- `npm upgrade -g @nexssp/cli` # upgrade nexss programmer
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

- --nxsI - interactive mode. When you need input from the user, use this flag.

## All commands

things to notice: nxsOut is a default output from a package, or function if use with Nexss Programmer project.
standard files

## Installation

```sh
npm i @nexssp/cli -g # install nexss programmer globally. Run everywere
npm init && npm i @nexssp/cli@2.4.20 # install per project

```

## Helper Functions

```sh
nexss -help # displays all availabe helper functions
nexss -env # displays environment info: versions, paths, package managers etc.
```

### Create new files

```sh
# Below we use package Id which generates unique Id (shorcuts)
nexss py h # it will create new helloWorld template for python
nexss js d # new default template for NodeJS
nexss v e # new empty template for Vlang

nexss file add my.r # it will show new templ
nexss file add my.r help # displays help for function
nexss Id help # displays help for package (Id is a Nexss Programmer's package)
```

### Compile programs / Installing programming environments

```sh
npx nexss program.r # without installing, just compile and run program
nexss helloWorld.py # it will compile program (if compiler does not exist, it will be installed)
nexss php run "print('x');" # 2.2.37+
nexss file add my.rs --edit # Will open list of templates for particular language, install editor (if not exists) and open file for editing.
```

```sh
nexss Id # Generates Id in the nxsOut
nexss Id --nxsAs="X" # if nxsAs it will be saved as
nexss Id --nxsAs="X" --server # it will start a server
nexss Id --nxsField # nxsField can be used for select data from some field. here nxsField is the same as nxsField=nxsOut
nexss https://nexss.com --nxsField --server # As nexss [url] reads url, with --server it will serve the url on 127.0.0.1:9369


```

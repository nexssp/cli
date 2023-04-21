# NEXSS PROGRAMMER 2.5.x

## News

### New Nexss Programmer 3.0+ in Golang

From the versions of 3.x, main engine of the Nexss Programmer will be written in **Golang**.

### Wasm

Nexss Programmer now supports Wasm files.

NOTE: **WIP:** compile and execute each supported programming language as Wasm+Wasi and many more wasm related features..

### Node.js and TypeScript - new runtime - Deno

Deno is "A modern runtime for JavaScript and TypeScript.".

```sh
# Node.js
nexss js default compiler deno # set your default runtime to deno
nexss js default compiler unset # to reset to default

# TypeScript
nexss ts default compiler deno # set your default runtime to deno
nexss ts default compiler unset # to reset to default
```

or set compiler per file individually. Works for every implemented language.

```js
// nexss-compiler: deno

console.log(`Hello from Deno! ${Deno.version.deno}`)
```

and run with `nexss myfile.js` or `nexss myfile.ts`

### New language - Solidity

Nexss Programmer 2.5.101 Supports **Solidity** - Solidity is an object-oriented, high-level language for implementing smart contracts.

### More info about languages

New `readme` functionality. You can now read more info from the README.md file from selected language eg.

```sh
nexss [ext] readme # eg:
nexss rs readme # for Rust
nexss sol readme # for Solidity etc. etc.

nexss rs help # for more info like creator, year etc..
nexss js help # ...
```

### Support for Kali Linux

Despite implementation of all languages has not been tested on Kali Linux, Nexss Programmer itself is already supported. For any issues please make a new item in the <https://github.com/nexssp/cli/issues>

### Nexss Clipboard/Save

Save clipboard data as text or image ('bmp','gif','ico','jpg','jpeg','png','tif').

Below command will save to file text or images with default filename
nexssp_2021-12-07T10_51_33 of course with the proper date and extension will be genearated:

```sh
nexss Clipboard/Save
```

Another one will check if saved file is an image, if not it will stop and show available extensions:

```sh
nexss Clipboard/Save myfilename.png
```

There is more examples: `nexss Clipboard/Save help`.

Note: _Clipboard/Save functionality was only tested on the Windows OS._

### Nexss Speak

**Nexss Programmer** version **2.5.78+** can **SPEAK!**

Here is a very basic example written in the nexss which speaking to you the website's title.

Please keep in mind that in the **Nexss Programmer** you can use over _50 programming languages_ together and make solutions. For example you can make some statistics in R, Python or any language and you can speak periodically without any distructions of your work. **Unlimited possibilities.**.

<i style="color:#22aa22">**And the most important: we would like to THANK YOU FOR YOUR SUPPORT! Have a wonderful day!**</i>

![image](https://user-images.githubusercontent.com/53263666/144295624-6846d7e3-940c-4cb2-8f7e-b29a9e7b49f2.png)

```sh
nexss Speak Welcome to the Nexss Programmer.
```

From now **@nexssp/cli** -> **nexss**!

NEW **(2.5.78+)**: Now you can just run `npx nexss`

You can also use **Nexss Programmer** as [separate tools](https://www.npmjs.com/search?q=nexssp) and as a full cli tool: [@nexssp/**cli**](https://www.npmjs.com/package/@nexssp/cli)

## Latest news

## Next versions (soon)

- New file type: **.vue** - you will be able to serve your vue files and start your development quickly by command: `nexss myapp.vue --serve`
- Separate, secure server package

## New functionalities

**Nexss Programmer** has been tested on Windows 11. If you will notice any issues please create [new issue](https://github.com/nexssp/project_vue3/issues).

Display help about any language with `nexss [ext] help`

```sh
nexss py help # diplays more info about available commands / per language
```

Now you can create new different types of projects with **hot reloading** easy:

- **Vue3**
- **Vue2**
- **React17**
- **Preact**

```sh
nexss p vue2 myvue2-project # creates new vue2 project with hotreloading.
nexss p vue2 myvue2-project --install # -- install all needed libs
nexss p react17 react17-project # creates new react17 project with hotreloading.
# the same --install cen be used here.
```

## Cli tools and libraries

- [@nexssp/**cli**](https://www.npmjs.com/package/@nexssp/cli) - nexss programmer - all tools, languages together
- [@nexssp/**command**](https://www.npmjs.com/package/@nexssp/command) - easy terminal commands
- [@nexssp/**config**](https://www.npmjs.com/package/@nexssp/config) - config system yml, json
- [@nexssp/**file**](https://www.npmjs.com/package/@nexssp/file) - file templates with over 50 programming language
- [@nexssp/**ensure**](https://www.npmjs.com/package/@nexssp/ensure) - ensure mulitple os packages installed
- [@nexssp/**cache**](https://www.npmjs.com/package/@nexssp/cache) - caching library
- [@nexssp/**language**](https://www.npmjs.com/package/@nexssp/language) - install programming environments, manage packages for each language
- [@nexssp/**min**](https://www.npmjs.com/package/@nexssp/min) - minimizing library
- [@nexssp/**os**](https://www.npmjs.com/package/@nexssp/os) - multiple os library
- [@nexssp/**package**](https://www.npmjs.com/package/@nexssp/package) - managing Nexss Programmer packages (git repositories)
- @nexssp/**process** - managing process library (will be added in future versions - it is available up to 2.4.x as nexss programmer feature)
- [@nexssp/**project**](https://www.npmjs.com/package/@nexssp/project) - managing Nexss Programmer projects, create new
- [@nexssp/**test**](https://www.npmjs.com/package/@nexssp/test) - testing library

## Libraries

- [@nexssp/**ansi**](https://www.npmjs.com/package/@nexssp/ansi) - colors, cursor
- [@nexssp/**const**](https://www.npmjs.com/package/@nexssp/const) - constants in JS/NodeJS
- [@nexssp/**data**](https://www.npmjs.com/package/@nexssp/data) - data validate, test
- [@nexssp/**dddebug**](https://www.npmjs.com/package/@nexssp/dddebug) - debugging functions
- [@nexssp/**expression-parser**](https://www.npmjs.com/package/@nexssp/expression-parser) - variable template system
- [@nexssp/**extend**](https://www.npmjs.com/package/@nexssp/extend) - extend standard functions of JavaScript/NodeJS
- [@nexssp/**logdebug**](https://www.npmjs.com/package/@nexssp/logdebug) - logging, debugging script
- [@nexssp/**packunpack**](https://www.npmjs.com/package/@nexssp/packunpack) - pack/unpack library with .gitignore
- [@nexssp/plugin](https://www.npmjs.com/package/@nexssp/plugin)- plugin system
- [@nexssp/**stack**](https://www.npmjs.com/package/@nexssp/stack) - pretty error stack
- [@nexssp/**system**](https://www.npmjs.com/package/@nexssp/system) - run system commands

```sh
✅ npm i @nexssp/cli -g #  Or npx @nexssp/cli
nexss help

Welcome to      ____
|..          | |             ``..      ..''             ..''''             ..''''
|  ``..      | |______           ``..''              .''                .''
|      ``..  | |                 ..'`..           ..'                ..'
|          ``| |___________  ..''      ``.. ....''             ....''
Programmer
```

**NOTE:** If there is anything which doesn't work please **create [new issue](https://github.com/nexssp/cli/issues/new)** and **it will be solved immediately** as we have a lot of emails and email issues can be delayed..Thank you! 💗

<p align="center">
<b><a href="https://github.com/nexssp/cli/wiki/Concept-Overview">Overview</a></b> |
<b><a href="https://github.com/nexssp/cli/wiki/Nexss-Programmer-Programming-Languages">List of Languages</a></b> |
<b><a href="https://github.com/nexssp/cli/wiki/Quick-Start">Installation</a></b> |
<b><a href="https://github.com/nexssp/cli/wiki">Documentation</a></b> |
<b><a href="https://github.com/nexssp/cli/wiki/Tutorials">Tutorials</a></b> |
<b><a href="https://nexss.com/11_blog-nexss-programmer/introduction/nexss-blog.html">Blog</a></b>
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

## ✅ Nexss Programmer functionalities

✔ Easy programming for _**multiplatform**_ in over 50 programming languages,  
✔ **Windows 10 and 11**, Linux: tested on: **Alpine**, **Amazon**, **Arch**, **CentOS**, **Debian**, **Fedora**, **FreeBSD**, **Gentoo**,**Mint**, **Oracle**, **Rhel**, **Suse Leap**, **Suse TumbleWeed**, **Ubuntu** and **MacOS** (experimental),  
✔ **NodeJS** versions: 12+ => **12.x**, **14.x**, **15.x**, **16.x**, **17.x**, **18.x**, **19.x**, **20.x**
✔ Over **50** programming languages: **Ada**, **Auto Hot Key**, **Autoit**, **Bash**, **Basic**, **Batch**, **C**, **Clojure**, **Coconut**, **Coffee Script**, **C++**, **Crystal**, **CSharp**, **D**, **Dart**, **Elixir**, **Erlang**, **Fortran**, **Go**, **Groovy**, **Haskell**, **Haxe**, **Hy**, **Java**, **JSON**, **Julia**, **Kotlin**, **LiveScript**, **Lua**, **Nexss**, **Nim**, **NodeJS**, **Octave**, **Perl**, **PHP**, **PowerShell**, **Pure Data**, **Python 2 & 3**, **R**, **Racket**, **Raku**, **Ruby**, **Rust**, **Scala**, **TCL/TK**, **Typescript**, **V**, **VBScript**, **Windows Scripting Host**, **Zig**

🔥 **Nexss Programmer** is _not only_ **a cli tool** 🔧 which helps to:

### ✅ Easy and intuitively install programming environments

Example:

- `nexss r install` OR `nexss py install` OR `nexss php install` OR ..
- `nexss [language file extension] install`

- **NEW:** easy shortcuts: `nexss py d` (creates file with default template), `nexss py h` (with helloWorld template), `nexss py e` (and empty file - if exists in the templates - !empty.[extension]) **(2.4.8+)**

### ✅ Compile, compose over **50** programming languages

if there is no compiler installed, nexss programmer will install it automatically.

- `nexss program.r`
- `nexss program.[any extension]`
- `npx @nexssp/cli program.r` # without installing nexss
- `nexss file add my.rs --edit` # Will open list of templates to select from for particular language, install editor (if not exists) and open file for editing.

### ✅ Run any programming language in seconds (eg. Google Colab Notebook)

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

### ✅ And much, much more

- Checkout our **blog** on [nexss.com](https://nexss.com/11_blog-nexss-programmer/introduction/nexss-blog.html)
- Documentation on [nexss programmer wiki](https://nexss.com/programmer_.html)

## 🔄NOTE: Upgrade to the latest versions

- `npm upgrade -g @nexssp/cli` # upgrade nexss programmer
- `nexss l u` # the same as `nexss langauge update` // Updating all installed language definitions
- `nexss pkg u` # the same as `nexss package update` // Updating all installed Nexss Programmer Packages
- `nexss cache rebuild` # rebuilding cache // handy when developing new language configurations (now is over 50)

**Nexss Programmer Presentation** (Youtube video):  
[![Nexss Programmer Presentation](https://img.youtube.com/vi/vs2tXMrZzzs/0.jpg)](https://www.youtube.com/watch?v=vs2tXMrZzzs)

## Functions

- --nxsI - interactive mode. When you need input from the user, use this flag.

## Example commands

Note: **nxsOut** is a default output/variable/field from a package, or function if use with Nexss Programmer project. You can change it by **--nxsOut**

## Installation

```sh
npm i @nexssp/cli -g # install nexss programmer globally. Run everywere
npm init && npm i @nexssp/cli@2.4.20 # install per project
```

## Helper Functions

```sh
nexss -help # displays all available helper functions
nexss -env # displays environment info: versions, paths, package managers etc. (nexssp-os env)
```

### Create new files from templates

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

### Packages

#### Global packages

Nexss Programmer has custom packages, written to show the possibilities of it. For example below there is a global package `Id`. To run it `nexss Id`. To see help `nexss Id help`. Every package in the nexss programmer is just a **Nexss Programmer Project**. You can add your own packages to global folder. Use `nexss -env` to see packages folder.

```sh
nexss Id # Generates Id in the nxsOut
nexss Id --nxsAs="X" # if nxsAs it will be saved as
nexss Id --nxsAs="X" --server # it will start a server
nexss Id --nxsField # nxsField can be used for select data from some field.
# Above nxsField is the same as nxsField=nxsOut
nexss https://nexss.com --nxsField --server # As nexss [url] reads url, with --server it will serve the url on 127.0.0.1:9369

```

#### Custom Packages

You can also run commands/packages/projects as absolute urls eg.

```sh
nexss /my/absolute/url --param=1
```

#### Nexss Programmer - How it works?

##### Stage 1

At first Nexss Programmer checks if the first argument passed is folder or file (program. eg myprogram.py).

###### Folder

If it is a folder it will check if there is a **\_nexss.yml** file inside, which is basically a config for Nexss Programmer package. If it is there then it will run this package. As you will find out more Nexss Programmer package can contain many programming languages solutions.

###### File

If it is a file _(other then **.nexss**)_ it will go and generate file definition (1 in this case). You can see what is beeing generated by adding `--nxsDryFiles`

```sh
nexss my.nexss --nxsDryFiles # Will show files collected (which will be run) in order with all the parameters
```

```json
{
  "name": "^^dir",
  "input": [
    {
      "name": "file",
      "validate": [
        {
          "type": "required"
        }
      ]
    }
  ],
  "specialArgs": [],
  "lineNumber": 9,
  "path": "/root/.nexss/packages/@dev/!Exec",
  "filename": "/root/.nexss/packages/@dev/!Exec/my.nexss"
}
```

```sh

nexss.my.nexss --nxsDry # will show the streams which are generated, with compilers, builders
```

✅ WIP - Add more here later..

## NOTE

Nexss Programmer apart from being innovative technology, uses great libraries and technologies. Please consider also support them.

For some of the languages compiler installations for Windows we use great Scoop from Luke Sampson. Please also consider support him.

Thank you.

More here: [**Nexss.com**](https://nexss.com/)

## Job Openings

Guys, we are looking for people who are willing to join our team. Please see latest job openings: <https://nexss.com/nexss-career.html>

## Please consider supporting our work

If you really like Nexss.com and our work, including Nexss Programmer, the sources of it please consider support us. You can either use **Ethereum**, **PayPal** or **Github sponsorship** for donations. Thank you!

Ethereum: **0xBFdA63dF06Fab2ddC08099257e4a419f8eecd991**.  
Through [PayPal](https://www.paypal.me/mapoart)  
Become a sponsor with [Github](https://github.com/sponsors/mapoart)

## Note for Windows 10 and 11 Python users

On Windows OS there are default files **python.exe** and **python3.exe** and they pointing to the shop which causing that is hard to install **Python** from other sources and issue appeared for many users. If you wish to use different **Python** distributions eg. provided by the Nexss Programmer please run below command. NOTE: you may want to make a backup to your files before deleting them entirely.

```ps1
# It will delete python.exe and python3.exe which point to the shop.
Remove-Item $env:USERPROFILE\AppData\Local\Microsoft\WindowsApps\python*.exe
```

You may need to install **Python** manually if any other issues appear and then use Nexss Programmer. It will recognize any installed python and you should be able to use the Nexss Programmer without any issues.

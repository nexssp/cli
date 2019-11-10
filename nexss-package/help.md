# Nexss Package

Manage packages for Nexss Programmer 2.0

## Modify global Nexss PROGRAMMER packages

```sh
nexss pkg add Blender --copyPackage # You can modify code from now in your folder and use it for your project.
```

## Examples

```sh
nexss package add git://sadasdas
nexss pkg add Mouse/Move # check for nexssp repo first
nexss pkg add Local/Folder
nexss pkg add Keyboard --type="#d" --copyPackage --saveNexss  --forceNexss # --copyPackage to the current folder (you can modify)

```

# Add

Adds nexss package to the actual folder.

## Examples

```sh
nexss pkg add Blender # this will copy Blender package to the current folder (you can modify a code to to meet your needs)
nexss pkg add Convert/VideoToGif --saveNexss # --saveConfig - adds package to the _nexss.yml
nexss pkg add Screen/AreaOCR --x1=20 --x2=30 --y1=100 --y2=300 --saveNexss # you can pass parameters to the package
nexss pkg add Keyboard --type="#d" --copyPackage --saveNexss  --forceNexss # --copyPackage to the current folder (you can modify)
```

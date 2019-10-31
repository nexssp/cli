# Nexss Languages Config

This needs to be review. **OUTDATED**

## Structure

- **config.base** the base of the configuration for all systems like title, description, extensions etc.
- **config.[platform]** the platform specified base

## Functions

```js
config.get("title"); // eg. NodeJS returns title of the  language (for display)
config.get("osPackageManagers"); // eg. {scoop:.., choco:..}
config.get("osPackageManagers.choco"); //......
```

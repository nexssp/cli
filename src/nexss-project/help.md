# Nexss Project

more here: <https://github.com/nexssp/cli/wiki/Projects>

Access to the commands can be done by `nexss project [cmd]` or `nexss p [cmd]`

## Creating new Project

```sh
# Below: folder projectName cannot exist Or --f will delete folder and all actual data!!! use it wisely.
nexss project new projectName # Or nexss p new projectName
nexss p n . # create project in the current folder only if not exist (no _nexss.yml config file)
nexss p n projectName # the same as above
nexss p n projectName -f # if project directory exists will add files without overwriting
nexss p n projectName -ff # Full Force - will overwrite files in the projectName directory
```

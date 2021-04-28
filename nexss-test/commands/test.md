# Command

Testing framework for Nexss Programmer's core and packages.

## Examples

```sh
# start at .java and ends on .java so only java will be done.
nexss test languages --startFrom=".java" --endsWith=".java"
# but above can be written like (only java will be done):
nexss test languages .java

nexss test nxs --startFromTest=5 # Starts from 5th tests
nexss test languages --startFrom=".java" # Will start from java
nexss test languages --endWith=".php" # Will end on php test
nexss test --onlyErrors # will display only errors
nexss test nxs --startFromTest=5 # Starts from 5th tests
```

## Logs

Logs are written in the logs folder

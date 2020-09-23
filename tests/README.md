# Nexss Tests

## Language tests

There is a test which needs to be run separately (languages) as it's take a lot of time to run the tests which install all compilers if they are not in the system installed already.

```sh
nexss test all --onlyErrors # onlyErros show only errors during run, so much less output
nexss test languages # This can take long time if it needs to install all compilers
nexss test
nexss test languages .js .r .pl # now you can select
```

## Per project

Every project can have own tests which are located in the `tests/` directory. So if you are at the path of the project, `nexss test` will pick the tests from the project. If you are in the folder which not contain any project, it will show tests from Nexss Programmer commands.

```sh
nexss test # to display available tests
nexss test all # all tests
```

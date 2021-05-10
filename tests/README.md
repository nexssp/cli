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

## Writing tests

### Stdout, stderr and return code 0

Nexss Programmer uses @nexssp/test package for testing. It uses nExec function which returns stdout if returnCode is 0 and stdout and stderr if return code is >0. However there are situations that there is stder but return code is 0. This way you need to use `--nxsPipeErrors` to forward them to the stdout stream. Or use 2>&1 in the command.

Eg: `nexss Output/End "works on Ubuntu" --platform:check="UBUNTU" --platform:noerror --nxsPipeErrors`

### Pipes and many " and '

Below works on Windows:

eg: `echo {"array":["x","y","z"]} | nexss Id --nxsSelect=array`

but if you put `'` around them it doesn't. Example of not working test: `echo '{"array":["x","y","z"]}' | nexss Id --nxsSelect=array`

### From 1.0.15

Now you can select function which execute your program. nExec(default) or nSpawn. IF one doesn't work check another. It really depends on complication of the parameters and stderr with exitCode:0.

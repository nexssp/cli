# Add

Adds a new file to the project (with template selection)

## Examples

```sh
nexss file add my.pl
nexss f add my.php
nexss f a myfile.java --noconfig # it will create file but not add to the config
nexss file add myfile1.js -f -t=helloWorld # will choice the helloWorld Template. -f for overwrite existing file (be careful)
```

Each language has own separate templates. If you wrote extension .pl - then Perl templates will be displayed, other extension, other language's templates.

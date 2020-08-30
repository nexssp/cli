# Nexss Process

Manage nexss programmer processes.

## Examples

```sh
nexss ps # list of processes
nexss ps clean # removes stopped processes from the queue
nexss ps stop 1234 # stop process (windows kill as there is only emulation) with id (you can kill any process you like on OS. Be careful)
nexss ps find 123 # finds proces with id
nexss ps find name node # finds process with name node
nexss ps find node # The same as above
```

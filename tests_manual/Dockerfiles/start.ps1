docker-machine start
docker-machine.exe env --shell powershell default | Invoke-Expression 
node .\_linuxDist.js .\AlpineNode16.Dockerfile local-empty
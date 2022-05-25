docker-machine start
docker-machine.exe env --shell powershell default | Invoke-Expression 
node .\_linuxDist.js .\Ubuntu1804.Dockerfile local-empty
# node .\_linuxDist.js .\Ubuntu2004.Dockerfile local-empty
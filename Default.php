<?php
# Nexss PROGRAMMER 2.0.0 - PHP
# Default template for JSON Data
# STDIN
$NexssStdin = fgets(STDIN);
$parsedJson = json_decode($NexssStdin,true);

# Modify Data
$parsedJson["test"] = "test";
// $parsedJson["test"] = "test";
$NexssStdout = json_encode($parsedJson, JSON_UNESCAPED_UNICODE);

# STDOUT
fwrite(STDOUT, $NexssStdout);

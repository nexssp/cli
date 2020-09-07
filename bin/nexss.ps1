$basedir = Split-Path $MyInvocation.MyCommand.Definition -Parent

if ($MyInvocation.expectingInput) {
    $input | & node  "$basedir/../nexss.js" $args
    $r = $LASTEXITCODE
}
else {
    & node  "$basedir/../nexss.js" $args
    $r = $LASTEXITCODE
}
  
exit $r

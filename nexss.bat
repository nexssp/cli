@ECHO OFF
SET script_path="%~dp0nexss"
IF EXIST %script_path% (
    node %script_path% %*
) ELSE (
    ECHO.
    ECHO ERROR: Could not find 'nexss' script in 'bin' folder, aborting...>&2
    EXIT /B 1
)
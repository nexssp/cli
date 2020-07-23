@echo off
REM nxsOnly just run a program without all features of nexss, just run a compiler with a program.
Powershell -noprofile -ex unrestricted -File "%~dp0nexss.ps1" %* --nxsOnly
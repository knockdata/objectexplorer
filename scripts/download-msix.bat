@echo off
REM Fetches the msixbundle the release workflow built for the Microsoft Store.
REM
REM   scripts\download-msix.bat            the newest successful Release run
REM   scripts\download-msix.bat 12345678   a specific run id
REM
REM This is the STORE package. It is a workflow artifact and not a release asset, on purpose: it
REM is unsigned until Partner Center signs it, and an unsigned package on the releases page is
REM the one thing nobody should ever download. Artifacts are not public URLs either, so this
REM goes through gh.
REM
REM The msix people download directly is a different file - signed in CI, published on the
REM releases page as ObjectExplorer-windows-<arch>.msix. Nothing here touches that one.
setlocal
cd /d "%~dp0.."

where gh >nul 2>nul
if errorlevel 1 (
	echo the GitHub CLI is missing: winget install GitHub.cli, then gh auth login
	exit /b 1
)

set RUN_ID=%~1
if "%RUN_ID%"=="" (
	echo looking up the newest successful Release run
	for /f "usebackq delims=" %%i in (`gh run list --repo knockdata/objectexplorer --workflow release.yml --status success --limit 1 --json databaseId --jq ".[0].databaseId"`) do set RUN_ID=%%i
)

if "%RUN_ID%"=="" (
	echo no successful Release run found
	exit /b 1
)

echo downloading the msixbundle from run %RUN_ID%
gh run download %RUN_ID% --repo knockdata/objectexplorer --name msixbundle --dir dist
if errorlevel 1 (
	echo that run has no msixbundle artifact - check https://github.com/knockdata/objectexplorer/actions/runs/%RUN_ID%
	exit /b 1
)

echo.
dir /b dist\*.msixbundle
echo.
echo this file is what goes to Partner Center, unsigned and untouched.
echo to try it first: scripts\self-sign-msix.bat
endlocal

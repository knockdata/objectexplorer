@echo off
REM Signs dist\ObjectExplorer-<version>.msixbundle with a throwaway certificate and installs it,
REM so the package can be launched before it is submitted.
REM
REM   scripts\self-sign-msix.bat
REM
REM FOR LOCAL TESTING ONLY. The file uploaded to Partner Center is the UNSIGNED one that
REM scripts\download-msix.bat fetched - the Store strips any signature and applies its own. This
REM writes dist\selfsign.* and a signed copy, and never touches the original.
REM
REM Run this from an elevated prompt: certutil writes to the machine's TrustedPeople store, and
REM without that entry Windows refuses to install a package it does not trust.
setlocal
cd /d "%~dp0.."

REM the publisher, the version and the signtool path all come out of scripts/msix.mjs, so the
REM certificate subject cannot drift from the manifest - signtool rejects the package the moment
REM they differ, with an error that says nothing about which one is wrong
for /f "usebackq delims=" %%i in (`node --input-type=module -e "import { publisher } from './scripts/msix.mjs'; console.log(publisher)"`) do set PUBLISHER=%%i
for /f "usebackq delims=" %%i in (`node --input-type=module -e "import { packageVersion } from './scripts/msix.mjs'; console.log(packageVersion)"`) do set PACKAGE_VERSION=%%i
for /f "usebackq delims=" %%i in (`node --input-type=module -e "import { findSdkTool } from './scripts/msix.mjs'; console.log(findSdkTool('signtool.exe'))"`) do set SIGNTOOL=%%i

if "%PUBLISHER%"=="" (
	echo could not read the publisher from scripts/msix.mjs
	exit /b 1
)

set BUNDLE=
for %%f in (dist\*.msixbundle) do set BUNDLE=%%f
if "%BUNDLE%"=="" (
	echo no msixbundle in dist - run scripts\download-msix.bat first
	exit /b 1
)

set SIGNED=dist\selfsigned.msixbundle
set PFX=dist\selfsign.pfx
set CER=dist\selfsign.cer
set PASSWORD=objectexplorer

echo publisher: %PUBLISHER%
echo bundle:    %BUNDLE%
echo.

echo creating the test certificate
powershell -NoProfile -Command ^
	"$subject = '%PUBLISHER%';" ^
	"$found = Get-ChildItem Cert:\CurrentUser\My ^| Where-Object { $_.Subject -eq $subject } ^| Select-Object -First 1;" ^
	"if ($found) { Write-Output ('reusing ' + $found.Thumbprint) } else { $found = New-SelfSignedCertificate -Type Custom -Subject $subject -KeyUsage DigitalSignature -CertStoreLocation Cert:\CurrentUser\My -TextExtension '2.5.29.37={text}1.3.6.1.5.5.7.3.3' -NotAfter (Get-Date).AddYears(2); Write-Output ('created ' + $found.Thumbprint) };" ^
	"$secret = ConvertTo-SecureString -String '%PASSWORD%' -Force -AsPlainText;" ^
	"Export-PfxCertificate -Cert $found -FilePath '%PFX%' -Password $secret ^| Out-Null;" ^
	"Export-Certificate -Cert $found -FilePath '%CER%' ^| Out-Null"
if errorlevel 1 exit /b 1

echo trusting it on this machine
certutil -addstore TrustedPeople "%CER%"
if errorlevel 1 (
	echo certutil failed - run this script from an elevated prompt
	exit /b 1
)

copy /y "%BUNDLE%" "%SIGNED%" >nul
echo signing the copy with %SIGNTOOL%
"%SIGNTOOL%" sign /fd SHA256 /f "%PFX%" /p "%PASSWORD%" "%SIGNED%"
if errorlevel 1 (
	echo signing failed - the certificate subject must equal the manifest Publisher exactly
	exit /b 1
)

echo installing
powershell -NoProfile -Command "Add-AppxPackage -Path '%SIGNED%' -ForceUpdateFromAnyVersion"
if errorlevel 1 exit /b 1

echo.
echo installed %PACKAGE_VERSION% - launch ObjectExplorer from the Start menu, then check
echo   %%USERPROFILE%%\.objectexplorer\app.log
echo.
echo to remove it:  powershell Get-AppxPackage *ObjectExplorer* ^| Remove-AppxPackage
echo submit %BUNDLE% to Partner Center, never %SIGNED%
endlocal

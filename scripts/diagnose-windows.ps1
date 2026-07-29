# ObjectExplorer Windows diagnosis.
#
# Run this on the machine that is failing and paste the whole output back:
#
#   powershell -ExecutionPolicy Bypass -File diagnose-windows.ps1
#
# It answers the three questions the app itself cannot: is the install still complete (or did
# Defender take something out of it), is what is installed the right architecture, and what
# did the app say before it died.

$ErrorActionPreference = "Continue"

function Section($title) {
	Write-Output ""
	Write-Output ("=" * 78)
	Write-Output $title
	Write-Output ("=" * 78)
}

Section "Machine"
Write-Output "OS              : $((Get-CimInstance Win32_OperatingSystem).Caption) build $([System.Environment]::OSVersion.Version)"
Write-Output "PROCESSOR_ARCH  : $env:PROCESSOR_ARCHITECTURE"
Write-Output "ARCHITEW6432    : $env:PROCESSOR_ARCHITEW6432   (set means this shell is emulated)"
Write-Output "PowerShell      : $($PSVersionTable.PSVersion)"

# per-user (the nsis oneClick default) first, then per-machine
$installDir = "$env:LOCALAPPDATA\Programs\ObjectExplorer"
if (-not (Test-Path $installDir)) { $installDir = "$env:ProgramFiles\ObjectExplorer" }
$dataDir = "$env:USERPROFILE\.objectexplorer"

Section "Install directory: $installDir"
if (Test-Path $installDir) {
	Get-ChildItem $installDir -File | Select-Object Name, Length, LastWriteTime | Format-Table -AutoSize | Out-String -Width 200
} else {
	Write-Output "NOT PRESENT — nothing is installed at either location"
}

Section "Packaged files vs what is on disk"
$manifestPath = Join-Path $installDir "resources\package-files.json"
if (Test-Path $manifestPath) {
	$manifest = Get-Content $manifestPath -Raw | ConvertFrom-Json
	Write-Output "manifest: $($manifest.productName) $($manifest.version) $($manifest.platform)/$($manifest.arch), $($manifest.files.Count) files"
	$missing = @()
	$changed = @()
	foreach ($entry in $manifest.files) {
		$full = Join-Path $installDir ($entry.path -replace '/', '\')
		$item = Get-Item -LiteralPath $full -ErrorAction SilentlyContinue
		if ($null -eq $item) {
			$missing += $entry.path
		} elseif ($item.Length -ne $entry.size) {
			$changed += "$($entry.path)  built $($entry.size) bytes, now $($item.Length)"
		}
	}
	if ($missing.Count -eq 0 -and $changed.Count -eq 0) {
		Write-Output "OK — every packaged file is present at its original size"
	} else {
		Write-Output "MISSING ($($missing.Count)):"
		$missing | ForEach-Object { Write-Output "  $_" }
		Write-Output "CHANGED ($($changed.Count)):"
		$changed | ForEach-Object { Write-Output "  $_" }
	}
} else {
	Write-Output "no manifest at $manifestPath (build predates it, or resources\ is gone)"
}

Section "Signatures"
$binaries = Get-ChildItem $installDir -File -Include *.exe, *.dll -Recurse -ErrorAction SilentlyContinue
if ($binaries) {
	$binaries | ForEach-Object {
		$signature = Get-AuthenticodeSignature $_.FullName
		"{0,-28} {1,-10} {2}" -f $_.Name, $signature.Status, $signature.SignerCertificate.Subject
	}
} else {
	Write-Output "no .exe or .dll found — this is what Defender quarantine looks like"
}

Section "Windows Defender"
Get-MpThreatDetection -ErrorAction SilentlyContinue |
	Sort-Object InitialDetectionTime -Descending |
	Select-Object -First 15 InitialDetectionTime, ThreatID, Resources |
	Format-List | Out-String -Width 200
Write-Output "--- current exclusions ---"
$preference = Get-MpPreference -ErrorAction SilentlyContinue
Write-Output "paths      : $($preference.ExclusionPath -join ', ')"
Write-Output "processes  : $($preference.ExclusionProcess -join ', ')"

Section "Data folder: $dataDir"
if (Test-Path $dataDir) {
	Get-ChildItem $dataDir | Select-Object Mode, Name, Length, LastWriteTime | Format-Table -AutoSize | Out-String -Width 200
	$switchesFile = Join-Path $dataDir "switches.txt"
	if (Test-Path $switchesFile) {
		Write-Output "--- switches.txt ---"
		Get-Content $switchesFile
	} else {
		Write-Output "no switches.txt (no Chromium switches are being applied)"
	}
	$crashpad = Join-Path $dataDir "Crashpad\reports"
	if (Test-Path $crashpad) {
		Write-Output "--- crash dumps ---"
		Get-ChildItem $crashpad -File | Select-Object Name, Length, LastWriteTime | Format-Table -AutoSize | Out-String -Width 200
	}
} else {
	Write-Output "NOT PRESENT — the app has never started far enough to create it"
}

Section "app.log (last 80 lines)"
$logPath = Join-Path $dataDir "app.log"
if (Test-Path $logPath) {
	Get-Content $logPath -Tail 80
} else {
	Write-Output "no app.log at $logPath"
}

Write-Output ""
Write-Output "Done. Paste everything above."

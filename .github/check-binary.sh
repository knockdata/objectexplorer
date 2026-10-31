#!/bin/bash
# .github/check-binary.sh <program> <version> — what create-release.yml asks of every binary,
# unsigned and signed: it answers --version with the version, and started as an instant
# server (mode=instant, the embedded browser app over the demo folder) it answers curl.
# Retried: a check right after the start races the bind. window=false: an .app's
# executable started with no terminal would otherwise be the desktop window.
# COMMAND_LINE=1: the command line's short name (Windows' oe.com): --version, then `help` exits 0;
# no server, since `oe mode=instant` is a command line that names no command (as `oe` on macOS
# and Linux), which an oe.com that misread its own name used to start as the server (v0.9.20).
set -u
program=$1
version=$2
port=${PORT:-9431}
said=$("$program" --version window=false | tr -d '\r')
if [ "$said" = "objectexplorer $version" ] && [ "${COMMAND_LINE:-0}" = "1" ]; then
	echo "$program --version: $said"
	if "$program" help > help.log 2>&1; then
		echo "$program help: exit 0"
	else
		cat help.log
		echo "::error::$program help did not exit 0"
		exit 1
	fi
elif [ "$said" = "objectexplorer $version" ]; then
	echo "$program --version: $said"
	"$program" mode=instant http_port=$port open=false window=false > server.log 2>&1 &
	server=$!
	answered=""
	attempt=0
	while [ -z "$answered" ] && [ $attempt -lt 60 ]; do
		if curl -sf -o /dev/null "http://127.0.0.1:$port/"; then
			answered=yes
		else
			sleep 1
		fi
		attempt=$((attempt + 1))
	done
	kill $server 2> /dev/null
	if [ "${RUNNER_OS:-}" = "Windows" ]; then
		# the .com waits for ObjectExplorer.exe (oe.com too), which a kill of the .com leaves running
		taskkill //F //IM ObjectExplorer.exe > /dev/null 2>&1
	fi
	if [ -n "$answered" ]; then
		echo "$program mode=instant answered curl on $port"
	else
		cat server.log
		echo "::error::$program as mode=instant did not answer curl on $port in 60 s"
		exit 1
	fi
else
	echo "::error::$program --version says '$said', not 'objectexplorer $version'"
	exit 1
fi

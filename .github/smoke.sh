#!/usr/bin/env bash
# Starts the packed binary with mode=server and waits for the backend to answer.
#
# This is the only step that runs what the build produced. v0.3.3 shipped a windows .exe that
# never got as far as running a line of JavaScript, and every job was green — because nothing
# here ever executed it.
#
#   bash .github/smoke.sh <path to the binary>
set -uo pipefail

binary="$1"
port=9421
log="$HOME/.objectexplorer/one.log"

serving() {
	curl -sf "http://127.0.0.1:$port" > /dev/null
}

report() {
	if [ -f "$log" ]; then
		echo "--- $log" >&2
		cat "$log" >&2
	else
		echo "--- no $log: the binary never ran any javascript" >&2
	fi
}

run() {
	rm -f "$log"
	"$binary" mode=server "port=$port" &
	local pid=$!
	local result=1

	for attempt in $(seq 1 60); do
		if serving; then
			echo "smoke: served on http://127.0.0.1:$port after ${attempt}s"
			result=0
			break
		fi
		# a binary that cannot start is the case this whole script exists for, so notice it
		# straight away rather than sitting out the full minute
		if kill -0 "$pid" 2> /dev/null; then
			sleep 1
		else
			wait "$pid"
			echo "smoke: the binary exited with $? after ${attempt}s without serving" >&2
			break
		fi
	done

	# the wait is what keeps bash from printing its own "Terminated" line about the job
	{ kill "$pid"; wait "$pid"; } 2> /dev/null

	if [ "$result" = 0 ]; then
		return 0
	else
		report
		return 1
	fi
}

# a leftover server from an earlier run answers just as well as a fresh one, and would turn
# this into a test that passes without ever starting the binary
if serving; then
	echo "smoke: something is already serving on port $port; stop it first" >&2
	exit 1
else
	run
fi

import fs from "node:fs";
import path from "node:path";

// an Error stringifies to "{}" because message and stack are not enumerable, so every
// logger.error(error) callsite used to write nothing. render errors by hand instead.
function formatValue(value) {
    if (value instanceof Error) {
        // stack already starts with "Name: message", so it is the whole story on its own
        return value.stack ? value.stack : `${value.name}: ${value.message}`;
    } else {
        if (value === null || value === undefined) {
            return String(value);
        } else {
            if (typeof value === "object") {
                try {
                    return JSON.stringify(value);
                } catch (error) {
                    return String(value);
                }
            } else {
                return String(value);
            }
        }
    }
}

export default function Logger(options) {
    const { userData } = options;
    const logPath = path.join(userData, "app.log");
    fs.mkdirSync(userData, { recursive: true });

    return { log, warn, error, logPath };

    function timestamp() {
        const d = new Date();
        const pad = (n) => String(n).padStart(2, "0");
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    }

    function write(level, args) {
        const msg = args.map(formatValue).join(" ");
        // append synchronously so a crash right after a log call still leaves the line on disk
        fs.appendFileSync(logPath, `${timestamp()} ${level} ${msg}\n`);
    }

    function log(...args) {
        console.log(...args);
        write("INFO ", args);
    }

    function warn(...args) {
        console.warn(...args);
        write("WARN ", args);
    }

    function error(...args) {
        console.error(...args);
        write("ERROR", args);
    }
}

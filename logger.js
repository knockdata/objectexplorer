import fs from "node:fs";
import path from "node:path";

export default function Logger(options) {
    const { userData } = options;
    const logPath = path.join(userData, "app.log");
    fs.mkdirSync(userData, { recursive: true });

    return { log, warn, error };

    function timestamp() {
        const d = new Date();
        const pad = (n) => String(n).padStart(2, "0");
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    }

    function write(level, args) {
        const msg = args.map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a))).join(" ");
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

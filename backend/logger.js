const pino = require("pino");
const path = require("path");
const fs = require("fs");

// 1. Define the log directory path
// If logger.js is in 'src', we go up one level ('..') to 'backend/logs'
const logDir = path.join(__dirname, "../logs");

// 2. FORCE create the directory if it doesn't exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// 3. Define the file path
const logFile = path.join(logDir, "backend.log");

const transport = pino.transport({
  targets: [
    // Target 1: Console (Colorful)
    {
      target: "pino-pretty",
      options: {
        destination: 1, // 1 = Console/Stdout
        colorize: true,
        translateTime: "SYS:standard",
        ignore: "pid,hostname",
      },
    },
    // Target 2: File (Readable Text)
    {
      target: "pino-pretty",
      options: {
        destination: logFile, // Write to our defined file path
        colorize: false, // No colors in file
        mkdir: true, // Try to create directory (backup)
        translateTime: "SYS:yyyy-mm-dd HH:MM:ss",
        ignore: "pid,hostname",
      },
    },
  ],
});

const logger = pino(transport);

module.exports = logger;

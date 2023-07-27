const winston = require('winston');
const moment = require('moment');
const path = require('path');
const fs = require('fs');

const logDirectory = path.join(__dirname, 'logs');

// Ensure the logs directory exists

fs.mkdirSync(logDirectory, { recursive: true });

// Function to generate the log file name with a timestamp
const generateLogFileName = () => {
  const timestamp = moment().format('YYYY-MM-DD-HH-mm');
  return `app_${timestamp}.log`;
};

// Custom logger instance with transports for console and file
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
  ),
  transports: [
    // Console transport for logging to console during development
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    }),
    // File transport for writing logs to a log file
    new winston.transports.File({
      filename: path.join(logDirectory, generateLogFileName()),
      maxsize: 10 * 1024 * 1024, // Max log file size (e.g., 10 MB)
      maxFiles: 5, // Maximum number of log files to keep
      tailable: true, // Rotate log files with a new timestamp
      zippedArchive: true, // Compress rotated log files
    }),
  ],
});

module.exports = logger;
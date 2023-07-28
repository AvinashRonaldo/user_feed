const winston = require('winston');
const path = require('path');
const fs = require('fs');
require('winston-daily-rotate-file');

var transport = new winston.transports.DailyRotateFile({
    frequency:'5m',
    filename: 'logs/app-%DATE%.log',
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '30m'
  });

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
    transport
  ],
});

module.exports = logger;
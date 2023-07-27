const cron = require('node-cron');
const fs = require('fs');
const path = require('path');
const logger = require('../helpers/logger');



// Function to delete old log files (older than 30 minutes)
const deleteOldLogFiles = () => {
const logFilesDirectory = path.join(__dirname, 'logs');
const logFiles = fs.readdirSync(logFilesDirectory);

const currentTime = Date.now();
const thirtyMinutesAgo = currentTime - 30 * 60 * 1000; // 30 minutes in milliseconds

logFiles.forEach((file) => {
    const filePath = path.join(logFilesDirectory, file);
    const fileStat = fs.statSync(filePath);
    if (fileStat.isFile() && fileStat.mtimeMs < thirtyMinutesAgo) {
      fs.unlinkSync(filePath);
      console.log('Deleted log file:', filePath);
    }
  });
};

// Schedule the log file deletion cron job 
cron.schedule('0 * * * *', () => {
  deleteOldLogFiles();
});

cron.schedule('*/5 * * * *', () => {
  logger.transports.file.rotate();
});
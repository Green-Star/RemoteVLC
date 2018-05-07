const winston = require('winston')
const path = require('path')
const mkdirp = require('mkdirp')

// Create the directory if it does not exist
const logsDirectory = __dirname + '/' + 'logs'
mkdirp.sync(logsDirectory)

const filename = path.basename(process.argv[2], path.extname(process.argv[2]))

const logger = new winston.Logger({
  transports: [
    new winston.transports.File({
      level: 'debug',
      filename: logsDirectory + '/' + filename + '.log',
      handleExceptions: true,
      json: true,
      maxsize: 5242880,
      maxFiles: 1,
      colorize: false,
      prettyPrint: true
    }),
    new winston.transports.Console({
      level: 'debug',
      handleExceptions: true,
      humanReadableUnhandledException: true,
      json: false,
      colorize: true,
      prettyPrint: true
    })
  ],
  exitOnError: true
})

// ---------------------------------------------------------------------------

module.exports = logger

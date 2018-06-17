import * as winston from 'winston'
import * as path from 'path'
import * as mkdirp from 'mkdirp'

/* Create the directory if it does not exist */
const logsDirectory = path.join(__dirname, '..', '..', '..', 'logs')
mkdirp.sync(logsDirectory)

let transports = []
/* Always log to the console */
transports.push(
  new winston.transports.Console({
    level: 'debug',
    handleExceptions: true,
    humanReadableUnhandledException: true,
    json: false,
    colorize: true,
    prettyPrint: true
  }))

/* Log to file as well (if a file to read has been provided on the cli) */
if (process.argv[2]) {
  let filename = path.basename(process.argv[2], path.extname(process.argv[2]))

  transports.push(
    new winston.transports.File({
      level: 'debug',
      filename: path.join(logsDirectory, filename + '.log'),
      handleExceptions: true,
      json: true,
      maxsize: 5242880,
      maxFiles: 1,
      colorize: false,
      prettyPrint: true
    }))
}

const internalLogger = new winston.Logger({
  transports: transports,
  exitOnError: true
})


const logger = {
  internalLogger: internalLogger,

  /* Used for morgan logs */
  stream: {
    write: function (message: string, encoding: string){
      internalLogger.verbose(message)
    }
  },

  error: function (message: string) {
    internalLogger.error(message)
  },

  warn: function (message: string) {
    internalLogger.warn(message)
  },

  info: function (message: string) {
    internalLogger.info(message)
  },

  verbose: function (message: string) {
    internalLogger.verbose(message)
  },

  debug: function (message: string) {
    internalLogger.debug(message)
  },

  silly: function (message: string) {
    internalLogger.silly(message)
  }
}

export { logger }

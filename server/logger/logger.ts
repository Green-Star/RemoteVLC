import * as winston from 'winston'
import * as path from 'path'
import * as mkdirp from 'mkdirp'

// Create the directory if it does not exist
const logsDirectory = __dirname + '/' + 'logs'
mkdirp.sync(logsDirectory)

const filename = path.basename(process.argv[2], path.extname(process.argv[2]))

const internalLogger = new winston.Logger({
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

// ---------------------------------------------------------------------------

export { logger }

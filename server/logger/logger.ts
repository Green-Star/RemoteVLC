import * as winston from 'winston'
import * as path from 'path'
import * as mkdirp from 'mkdirp'

let transports = []

/* Use a mock logger when testing ... */
if (process.env.NODE_ENV === 'test') {

  /* When testing, we will only log errors (which should never occured) ... */
  transports.push(
    new winston.transports.Console({
      level: 'error',
      handleExceptions: true
    }))

/* And a real one for the prod environment */
} else {
  /* Create the directory if it does not exist */
  const logsDirectory = path.join(__dirname, '..', '..', '..', 'logs')
  mkdirp.sync(logsDirectory)

  /* Always log to the console */
  transports.push(
    new winston.transports.Console({
      level: 'debug',
      handleExceptions: true,
      format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        )
    }))

  /* Log to file as well (if a file to read has been provided on the cli) */
  if (process.argv[2]) {
    let filename = path.basename(process.argv[2], path.extname(process.argv[2]))

    transports.push(
      new winston.transports.File({
        level: 'debug',
        filename: path.join(logsDirectory, filename + '.log'),
        handleExceptions: true,
        maxsize: 5242880,
        maxFiles: 1,
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.printf(info => `{"level":${info.level},"message":${JSON.stringify(info.message)}}`)
        )
      }))
  }
}


let internalLogger = winston.createLogger({
  transports: transports,
  exitOnError: true
})


let logger = {

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

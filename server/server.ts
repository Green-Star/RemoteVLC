import express = require('express')
import * as http from 'http'
import morgan = require('morgan')
import * as bodyParser from 'body-parser'
import * as path from 'path'
import methodOverride = require('method-override')
import { logger } from './logger'
import { PlayerFactory } from './player'
import { Router } from './router'

if (!process.argv[2]) {
  logger.error('Missing media filename to play')
  logger.info('Usage: ' + process.argv[0] + ' ' + process.argv[1] + ' <media filename>')
  process.exit(1)
}

logger.info('Starting Remote control for ' + process.argv[2])

/*** Start player control ***/
logger.info('Spawning player ...')

let player = PlayerFactory.getPlayer('vlc', process.argv[2])
player.start()

/*** Start WebUI control ***/
logger.info('Spawning web UI')

const app = express()
let router = new Router(player)

/* Use client/dist folder to serve static files */
app.use(express.static(path.join(path.dirname(path.dirname(__dirname)), 'client', 'dist')))

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(bodyParser.json({ type: 'application/vnd.api+json' }))
app.use(methodOverride())

/* Log requests */
app.use(morgan('dev', { stream: logger.stream }))

app.use('/', router.getInternalRouter())

const server = http.createServer(app)
server.listen(8080)

logger.info('Server started')

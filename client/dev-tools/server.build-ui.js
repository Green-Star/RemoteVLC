'use strict'

var util = require('util')
var http = require('http')
var path = require('path')
var morgan = require('morgan')
var express = require('express')
var bodyParser = require('body-parser')
var methodOverride = require('method-override')
var Router = require(path.join(__dirname, '..', '..', 'dist', 'server', 'router')).Router
var logger = require(path.join(__dirname, '..', '..', 'dist', 'server', 'logger')).logger
var playerFactory = require(path.join(__dirname, '..', '..', 'dist', 'server', 'player')).PlayerFactory

if (!process.argv[2]) {
    logger.error('Missing media filename to play')
    logger.info('Usage: ' + process.argv[0] + ' ' + process.argv[1] + ' <media filename>')
    process.exit(1)
}

logger.info('Starting web UI HMR')

/*** Start player control ***/
// Use a mock player when building WebUI
logger.info('Spawning mock player ...')
var player = playerFactory.getPlayer('mock-player', process.argv[2])
player.start()

/*** Start WebUI control ***/
logger.info('Spawning web UI')
var app = express()
var router = new Router(player)


/*** Enable HMR ***/
// Step 1: Create & configure a webpack compiler
var webpack = require('webpack')
var webpackConfig = require('./webpack.config.build-ui')
var compiler = webpack(webpackConfig)

// Step 2: Attach the dev middleware to the compiler & the server
app.use(require("webpack-dev-middleware")(compiler, {
    logLevel: 'warn', publicPath: webpackConfig.output.publicPath
}))
// Step 3: Attach the hot middleware to the compiler & the server
app.use(require("webpack-hot-middleware")(compiler, {
    log: console.log, path: '/__webpack_hmr', heartbeat: 10 * 1000
}))

/* Use client/dist folder to serve static files */
app.use(express.static(path.join(path.dirname(path.dirname(__dirname)), 'client', 'dist')))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(bodyParser.json({ type: 'application/vnd.api+json' }))
app.use(methodOverride())

/* Log requests */
app.use(morgan('dev', { stream: logger.stream }))

app.use('/', router.getInternalRouter())

var server = http.createServer(app)
server.listen(8080)

logger.info('Server started')
logger.info('Server listening on ' + server.address())

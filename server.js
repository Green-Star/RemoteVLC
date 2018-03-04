const express = require('express')
const http = require('http')
const morgan = require('morgan')

console.log('Starting Remote control for ' + process.argv[2])

/*** Start player control ***/
console.log('Spawning VLC ...')

const player = require('./vlc-player')
player.start('vlc', process.argv[2])

/*** Start WebUI control ***/
console.log('Spawning web UI')

const app = express()
const router = require('./router')

router.create(player)
/* Use client/dist folder to serve static files */
app.use(express.static(__dirname + '/client/dist'))
app.use('/', router)

const server = http.createServer(app)
server.listen(8080)

const express = require('express')
const http = require('http')
const morgan = require('morgan')

console.log('Starting Remote control for ' + process.argv[2])

/*** Start player control ***/
console.log('Spawning VLC ...')

const player = require('./vlc-player')
player.start('vlc')

/*** Start WebUI control ***/
console.log('Spawning web UI')

const app = express()
const router = require('./router')

app.use('/', router)

const server = http.createServer(app)
server.listen(8080)

const express = require('express')
const http = require('http')
const morgan = require('morgan')
const newTask = require('./task').newTask

console.log('Starting Remote control for ' + process.argv[2])

/*** Start player control ***/
console.log('Spawning VLC ...')

//const player = require('./vlc-player')
//player.start('vlc', process.argv[2])

// Use a mock player when building WebUI
const playerTest = {
  title: "La grande aventure Lego.mkv",
  isPlaying: false,
  volume: 129,
  time: 10,
  length: 6035,
  tracks: {
    video: [
      {id: -1, language: "Désactiver", selected: false},
      {id: 0, title: "Piste 1", language: "Anglais", selected: true}
    ],
    audio: [
    ],
    subtitle: [
      {id: -1, language: "Désactiver", selected: true},
      {id: 3, title: "FRF", language: "Français", selected: false},
      {id: 4, title: "FR", language: "Français", selected: false},
      {id: 5, title: "EN",language: "Anglais", selected: false}
    ]
  }
}
const player = playerTest

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

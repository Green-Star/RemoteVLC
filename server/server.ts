import express = require('express')
import * as http from 'http'
import morgan = require('morgan')
import * as bodyParser from 'body-parser'
import * as path from 'path'
import methodOverride = require ('method-override')
import { logger } from './logger'
import { VLCPlayer } from './vlc-player'
import { PlayerFactory } from './player-factory'

if (!process.argv[2]) {
  logger.error('Missing media filename to play')
  logger.info('Usage: ' + process.argv[0] + " " + process.argv[1] + " <media filename>")
  process.exit(1)
}

logger.info('Starting Remote control for ' + process.argv[2])

/*** Start player control ***/
logger.info('Spawning player ...')

let player = PlayerFactory.getPlayer('vlc', process.argv[2])
player.start()

// Use a mock player when building WebUI
/*
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
  },
  timer: undefined
}
const player = playerTest
*/

/*** Start WebUI control ***/
logger.info('Spawning web UI')

const app = express()
const router = require('./router')

router.create(player)
/* Use client/dist folder to serve static files */
app.use(express.static(path.dirname(__dirname) + '/client/dist'))

app.use(bodyParser.urlencoded({extended:true}));// get information from html forms
app.use(bodyParser.json())
app.use(bodyParser.json({ type: 'application/vnd.api+json' }))
app.use(methodOverride())

/* Log requests */
//app.use(morgan('dev', { stream: logger.stream }))

app.use('/', router.apiRouter)

const server = http.createServer(app)
server.listen(8080)

logger.info('Server started')

/*
player.play().then((context) => {
  //console.log(`Player is playing ${context}`)
})
setTimeout(asyncData, 5000)
setTimeout(play, 7000)
setTimeout(pause, 12000)
setTimeout(play, 17000)

function asyncData () {
  player.getMediaInformations().then((context) => {
    console.log('MEDIA INFORMATIONS FONCTIONNE EN PROMEEEEEEESSSSSSEEEESS')
    console.log('La preuve : ' + JSON.stringify(context[0]))
  })
  player.setTime(10).then((context) => {
    console.log(JSON.stringify(context))
  })
  /*
  player.getTime().then((context) => {
    console.log('Et voiles les asyncData: ' + JSON.stringify(context))
  })
*/
/*
}

function play () {
  player.play().then((context) => {
    context.timer = undefined
    console.log(`*** PLAY *** ${JSON.stringify(context)}`)
  })
}

function pause () {
  player.pause().then((context) => {
    context.timer = undefined
    console.log(`*** PAUSE *** ${JSON.stringify(context)}`)
  })
}
*/
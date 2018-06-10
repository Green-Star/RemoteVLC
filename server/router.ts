import * as express from 'express'
import * as path from 'path'
import { logger } from './logger'
import { PlayerData } from './player-data.model'
import { PlayerMethods } from './player-methods.model'

/* playerInstance is just an object implementing the PlayerMethods */
let playerInstance: PlayerMethods

let router = express.Router()

router.get('/api', todo)
router.get('/api/all', getMediaInformations)

router.put('/api/pause', pause)
router.put('/api/play', play)

router.get('/api/time', getTime)
router.put('/api/time/:time', setTime)

router.get('/api/volume', getVolume)
router.put('/api/volume/up', volumeUp)
router.put('/api/volume/down', volumeDown)
router.put('/api/volume/:volume', setVolume)

router.put('/api/video/:id', setVideoTrack)
router.put('/api/audio/:id', setAudioTrack)
router.put('/api/subtitle/:id', setSubtitleTrack)
router.get('/ping', pong)

router.use('/*', function (req, res, next) {
  res.sendFile(path.join(__dirname, './index.html'))
})

export = { 
  apiRouter: router,
  create: function (player: PlayerMethods) {
    playerInstance = player
  }
}

function pong (req: express.Request, res: express.Response, next: express.NextFunction) {
  return res.send('pong').status(200).end()
}

function getMediaInformations (req: express.Request, res: express.Response, next: express.NextFunction) {
  /* player.getMediaInformations returns an array filled with the results of all the promises created */
  /* In this case, we need to return only one result of this array (say array[0]) */
  playerInstance
    .getMediaInformations()
    .then(context => res.json(context[0]))
    .catch(err => next(err))
}

function play (req: express.Request, res: express.Response, next: express.NextFunction) {
  playerInstance
    .play()
    .then(context => res.json(context))
    .catch(err => next(err))
}

function pause (req: express.Request, res: express.Response, next: express.NextFunction) {
  playerInstance
    .pause()
    .then(context => res.json(context))
    .catch(err => next(err))
}

function getVolume (req: express.Request, res: express.Response, next: express.NextFunction) {
  playerInstance
    .getVolume()
    .then(context => res.json(context))
    .catch(err => next(err))
}

function setVolume (req: express.Request, res: express.Response, next: express.NextFunction) {
  let volume: number = +req.params.volume

  playerInstance
    .setVolume(volume)
    .then(context => res.json(context))
    .catch(err => next(err))
}

function volumeUp (req: express.Request, res: express.Response, next: express.NextFunction) {
  playerInstance
    .volumeUp()
    .then(context => res.json(context))
    .catch(err => next(err))
}

function volumeDown (req: express.Request, res: express.Response, next: express.NextFunction) {
  playerInstance
    .volumeDown()
    .then(context => res.json(context))
    .catch(err => next(err))
}

function setTime (req: express.Request, res: express.Response, next: express.NextFunction) {
  let time: number = +req.params.time

  playerInstance
    .setTime(time)
    .then(context => res.json(context))
    .catch(err => next(err))
}

function getTime (req: express.Request, res: express.Response, next: express.NextFunction) {
  playerInstance
    .getTime()
    .then(context => res.json(context))
    .catch(err => next(err))
}


function setVideoTrack (req: express.Request, res: express.Response, next: express.NextFunction) {
  let id: number = +req.params.id
  
  playerInstance
    .setVideoTrack(id)
    .then(context => res.json(context))
    .catch(err => next(err))
}

function setAudioTrack (req: express.Request, res: express.Response, next: express.NextFunction) {
  let id: number = +req.params.id
  
  playerInstance
    .setAudioTrack(id)
    .then(context => res.json(context))
    .catch(err => next(err))
}

function setSubtitleTrack (req: express.Request, res: express.Response, next: express.NextFunction) {
  let id: number = +req.params.id
  
  playerInstance
    .setSubtitleTrack(id)
    .then(context => res.json(context))
    .catch(err => next(err))
}


function todo (req: express.Request, res: express.Response, next: express.NextFunction) {
  logger.debug('Not yet implemented')
  return res.send('Not yet implemented').status(200).end()
}

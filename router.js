const express = require('express')
const apiRouter = express.Router()
const path = require('path')
const logger = require('./logger')

apiRouter.player = {}

apiRouter.get('/api', todo)
apiRouter.get('/api/all', getMediaInformations)

apiRouter.put('/api/pause', pause)
apiRouter.put('/api/play', play)

apiRouter.get('/api/time', getTime)
apiRouter.put('/api/time/:time', setTime)

apiRouter.get('/api/volume', getVolume)
apiRouter.put('/api/volume/up', volumeUp)
apiRouter.put('/api/volume/down', volumeDown)
apiRouter.put('/api/volume/:volume', setVolume)

apiRouter.put('/api/video/:id', setVideoTrack)
apiRouter.put('/api/audio/:id', setAudioTrack)
apiRouter.put('/api/subtitle/:id', setSubtitleTrack)
apiRouter.get('/ping', pong)

apiRouter.use('/*', function (req, res, next) {
  res.sendFile(path.join(__dirname, './index.html'))
})

apiRouter.create = function (player) {
  apiRouter.player = player
}

module.exports = apiRouter

function pong (req, res, next) {
  return res.send('pong').status(200).end()
}

function getMediaInformations (req, res, next) {
  /* player.getMediaInformations returns an array filled with the results of all the promises created */
  /* In this case, we need to return only one result of this array (say array[0]) */
  apiRouter.player
    .getMediaInformations()
    .then(context => res.json(playerToJSON(context[0])))
    .catch(err => next(err))
}

function play (req, res, next) {
  apiRouter.player
    .play()
    .then(context => res.json(playerToJSON(context)))
    .catch(err => next(err))
}

function pause (req, res, next) {
  apiRouter.player
    .pause()
    .then(context => res.json(playerToJSON(context)))
    .catch(err => next(err))
}

function getVolume (req, res, next) {
  apiRouter.player
    .getVolume()
    .then(context => res.json(context))
    .catch(err => next(err))
}

function setVolume (req, res, next) {
  let volume = +req.params.volume

  apiRouter.player
    .setVolume(volume)
    .then(context => res.json(playerToJSON(context)))
    .catch(err => next(err))
}

function volumeUp (req, res, next) {
  apiRouter.player
    .volumeUp()
    .then(context => res.json(playerToJSON(context)))
    .catch(err => next(err))
}

function volumeDown (req, res, next) {
  apiRouter.player
    .volumeDown()
    .then(context => res.json(playerToJSON(context)))
    .catch(err => next(err))
}

function setTime (req, res, next) {
  let time = +req.params.time

  apiRouter.player
    .setTime(time)
    .then(context => res.json(playerToJSON(context)))
    .catch(err => next(err))
}

function getTime (req, res, next) {
  apiRouter.player
    .getTime()
    .then(context => res.json(playerToJSON(context)))
    .catch(err => next(err))
}


function setVideoTrack (req, res, next) {
  let id = +req.params.id
  
  apiRouter.player
    .setVideoTrack(id)
    .then(context => res.json(playerToJSON(context)))
    .catch(err => next(err))
}

function setAudioTrack (req, res, next) {
  let id = +req.params.id
  
  apiRouter.player
    .setAudioTrack(id)
    .then(context => res.json(playerToJSON(context)))
    .catch(err => next(err))
}

function setSubtitleTrack (req, res, next) {
  let id = +req.params.id
  
  apiRouter.player
    .setSubtitleTrack(id)
    .then(context => res.json(playerToJSON(context)))
    .catch(err => next(err))
}


function todo (req, res, next) {
  logger.debug('Not yet implemented')
  return res.send('Not yet implemented').status(200).end()
}

function playerToJSON (player) {
  return {
    title: player.title,
    isPlaying: player.isPlaying,
    volume: player.volume,
    time: player.time,
    length: player.length,
    tracks: player.tracks
  }
}
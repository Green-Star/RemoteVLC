const express = require('express')
const apiRouter = express.Router()
const path = require('path')

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

apiRouter.put('/api/video/:id', todo)
apiRouter.put('/api/audio/:id', todo)
apiRouter.put('/api/subtitle/:id', todo)
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
  return res.json(playerToJSON(apiRouter.player))
}

function play (req, res, next) {
  apiRouter.player.isPlaying = true
  apiRouter.player.timer = setInterval(updatePlayer, 1000)
  return res.json(playerToJSON(apiRouter.player))
}

function pause (req, res, next) {
  apiRouter.player.isPlaying = false
  clearInterval(apiRouter.player.timer)
  return res.json(playerToJSON(apiRouter.player))
}

function getVolume (req, res, next) {
/*  apiRouter.player
    .then(context => res.json(context))
    .catch(err => next(err))
*/
  return res.json(playerToJSON(apiRouter.player))
}

function setVolume (req, res, next) {
  let volume = +req.params.volume

  apiRouter.player.volume = volume
  let result = apiRouter.player

  return res.json(playerToJSON(apiRouter.player))
}

function volumeUp (req, res, next) {
  apiRouter.player.volume += 10

  return res.json(playerToJSON(apiRouter.player))
}

function volumeDown (req, res, next) {
  apiRouter.player.volume -= 10

  return res.json(playerToJSON(apiRouter.player))
}

function setTime (req, res, next) {
  let time = +req.params.time

  apiRouter.player.time = time
  let result = apiRouter.player

  return res.json(playerToJSON(result))
}

function getTime (req, res, next) {
  let result = apiRouter.player
//      .then(context => res.json(context))
//      .catch(err => next(err))
  return res.json(playerToJSON(result))
}

function todo (req, res, next) {
  console.log('Not yet implemented')
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

function updatePlayer () {
  apiRouter.player.time++
}
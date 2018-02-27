const express = require('express')
const apiRouter = express.Router()
const path = require('path')

apiRouter.player = {}

apiRouter.get('/api', todo)
apiRouter.get('/api/all', getMediaInformations)

apiRouter.put('/api/pause', play)
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
  return res.json(apiRouter.player)
}

function play (req, res, next) {
  apiRouter.player.isPlaying = !apiRouter.player.isPlaying
  return res.json(apiRouter.player)
}

function getVolume (req, res, next) {
/*  apiRouter.player
    .then(context => res.json(context))
    .catch(err => next(err))
*/
  return res.json(apiRouter.player)
}

function setVolume (req, res, next) {
  let volume = +req.params.volume

  apiRouter.player.volume = volume
  let result = apiRouter.player

  return res.json(apiRouter.player)
}

function volumeUp (req, res, next) {
  apiRouter.player.volume += 10

  return res.json(apiRouter.player)
}

function volumeDown (req, res, next) {
  apiRouter.player.volume -= 10

  return res.json(apiRouter.player)
}

function setTime (req, res, next) {
  let time = +req.params.time

  apiRouter.player.time = time
  let result = apiRouter.player

  return res.json(result)
}

function getTime (req, res, next) {
  let result = apiRouter.player
//      .then(context => res.json(context))
//      .catch(err => next(err))
  return res.json(result)
}

function todo (req, res, next) {
  console.log('Not yet implemented')
  return res.send('Not yet implemented').status(200).end()
}

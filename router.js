const express = require('express')
const apiRouter = express.Router()

apiRouter.use(function (req, res, next) {
  console.log('Time: ', Date.now())
  next()
})

apiRouter.get('/pause', todo)
apiRouter.get('/play', todo)
apiRouter.get('/video', todo)
apiRouter.get('/sound', todo)
apiRouter.get('/subtitle', todo)
apiRouter.get('/ping', pong)

function pong (req, res, next) {
  return res.send('pong').status(200).end()
}

function todo (req, res, next) {
  console.log('Not yet implemented')
  return res.send('Not yet implemented').status(200).end()
}

module.exports = apiRouter

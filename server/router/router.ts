import * as express from 'express'
import * as path from 'path'
import { logger } from '../logger'
import { PlayerData, PlayerMethods } from '../models'

export class Router {
  private router: express.Router
  /* playerInstance is just an object implementing the PlayerMethods */
  private player: PlayerMethods
  
  constructor (player: PlayerMethods) {
    this.router = express.Router()
    this.player = player
    this.initializeRouting()
  }

  public getInternalRouter(): express.Router {
    return this.router
  }

  private initializeRouting (): void {
    this.router.get('/api', (req, res, next) => this.todo(req, res, next))
    this.router.get('/api/all', (req, res, next) => this.getMediaInformations(req, res, next))

    this.router.put('/api/pause', (req, res, next) => this.pause(req, res, next))
    this.router.put('/api/play', (req, res, next) => this.play(req, res, next))

    this.router.get('/api/time', (req, res, next) => this.getTime(req, res, next))
    this.router.put('/api/time/:time', (req, res, next) => this.setTime(req, res, next))

    this.router.get('/api/volume', (req, res, next) => this.getVolume(req, res, next))
    this.router.put('/api/volume/up', (req, res, next) => this.volumeUp(req, res, next))
    this.router.put('/api/volume/down', (req, res, next) => this.volumeDown(req, res, next))
    this.router.put('/api/volume/:volume', (req, res, next) => this.setVolume(req, res, next))

    this.router.put('/api/video/:id', (req, res, next) => this.setVideoTrack(req, res, next))
    this.router.put('/api/audio/:id', (req, res, next) => this.setAudioTrack(req, res, next))
    this.router.put('/api/subtitle/:id', (req, res, next) => this.setSubtitleTrack(req, res, next))
    this.router.get('/ping', (req, res, next) => this.pong(req, res, next))

    this.router.use('/*', function (req: express.Request, res: express.Response, next: express.NextFunction) {
      res.sendFile(path.join(__dirname, './index.html'))
    })
  }

  private pong (req: express.Request, res: express.Response, next: express.NextFunction) {
    return res.send('pong').status(200).end()
  }

  private getMediaInformations (req: express.Request, res: express.Response, next: express.NextFunction) {
    /* player.getMediaInformations returns an array filled with the results of all the promises created */
    /* In this case, we need to return only one result of this array (say array[0]) */
    this.player
      .getMediaInformations()
      .then(context => res.json(context[0]))
      .catch(err => next(err))
  }

  private play (req: express.Request, res: express.Response, next: express.NextFunction) {
    this.player
      .play()
      .then(context => res.json(context))
      .catch(err => next(err))
  }

  private pause (req: express.Request, res: express.Response, next: express.NextFunction) {
    this.player
      .pause()
      .then(context => res.json(context))
      .catch(err => next(err))
  }

  private getVolume (req: express.Request, res: express.Response, next: express.NextFunction) {
    this.player
      .getVolume()
      .then(context => res.json(context))
      .catch(err => next(err))
  }

  private setVolume (req: express.Request, res: express.Response, next: express.NextFunction) {
    let volume: number = +req.params.volume

    this.player
      .setVolume(volume)
      .then(context => res.json(context))
      .catch(err => next(err))
  }

  private volumeUp (req: express.Request, res: express.Response, next: express.NextFunction) {
    this.player
      .volumeUp()
      .then(context => res.json(context))
      .catch(err => next(err))
  }

  private volumeDown (req: express.Request, res: express.Response, next: express.NextFunction) {
    this.player
      .volumeDown()
      .then(context => res.json(context))
      .catch(err => next(err))
  }

  private setTime (req: express.Request, res: express.Response, next: express.NextFunction) {
    let time: number = +req.params.time

    this.player
      .setTime(time)
      .then(context => res.json(context))
      .catch(err => next(err))
  }

  private getTime (req: express.Request, res: express.Response, next: express.NextFunction) {
    this.player
      .getTime()
      .then(context => res.json(context))
      .catch(err => next(err))
  }


  private setVideoTrack (req: express.Request, res: express.Response, next: express.NextFunction) {
    let id: number = +req.params.id
    
    this.player
      .setVideoTrack(id)
      .then(context => res.json(context))
      .catch(err => next(err))
  }

  private setAudioTrack (req: express.Request, res: express.Response, next: express.NextFunction) {
    let id: number = +req.params.id
    
    this.player
      .setAudioTrack(id)
      .then(context => res.json(context))
      .catch(err => next(err))
  }

  private setSubtitleTrack (req: express.Request, res: express.Response, next: express.NextFunction) {
    let id: number = +req.params.id
    
    this.player
      .setSubtitleTrack(id)
      .then(context => res.json(context))
      .catch(err => next(err))
  }


  private todo (req: express.Request, res: express.Response, next: express.NextFunction) {
    logger.debug('Not yet implemented')
    return res.send('Not yet implemented').status(200).end()
  }

}

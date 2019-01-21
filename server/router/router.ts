import * as express from 'express'
import * as path from 'path'
import { logger } from '../logger'
import { PlayerData } from '../../shared'
import { PlayerMethods } from '../models'

export class Router {
  private router: express.Router
  /* player is just an object implementing the PlayerMethods */
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
    this.router.put('/api/time/add/:seconds', (req, res, next) => this.addTime(req, res, next))

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

  private async getMediaInformations (req: express.Request, res: express.Response, next: express.NextFunction) {
    /* player.getMediaInformations returns an array filled with the results of all the promises created */
    /* In this case, we need to return only one result of this array (say array[0]) */
    try {

      let result = await this.player.getMediaInformations()
      res.json(result[0])

    } catch (error) {
      next(error)
    }
  }

  private async play (req: express.Request, res: express.Response, next: express.NextFunction) {
    try {

      res.json(await this.player.play())

    } catch (error) {
      next(error)
    }
  }

  private async pause (req: express.Request, res: express.Response, next: express.NextFunction) {
    try {

      res.json(await this.player.pause())

    } catch (error) {
      next(error)
    }
  }

  private async getVolume (req: express.Request, res: express.Response, next: express.NextFunction) {
    try {

      res.json(await this.player.getVolume())

    } catch (error) {
      next(error)
    }
  }

  private async setVolume (req: express.Request, res: express.Response, next: express.NextFunction) {
    try {

      let volume: number = +req.params.volume
      res.json(await this.player.setVolume(volume))

    } catch (error) {
      next(error)
    }
  }

  private async volumeUp (req: express.Request, res: express.Response, next: express.NextFunction) {
    try {

      res.json(await this.player.volumeUp())

    } catch (error) {
      next(error)
    }
  }

  private async volumeDown (req: express.Request, res: express.Response, next: express.NextFunction) {
    try {

      res.json(await this.player.volumeDown())

    } catch (error) {
      next(error)
    }
  }

  private async setTime (req: express.Request, res: express.Response, next: express.NextFunction) {
    try {

      let time: number = +req.params.time
      res.json(await this.player.setTime(time))

    } catch (error) {
      next(error)
    }
  }

  private async getTime (req: express.Request, res: express.Response, next: express.NextFunction) {
    try {

      res.json(await this.player.getTime())
    
    } catch (error) {
      next(error)
    }
  }

  private async addTime (req: express.Request, res: express.Response, next: express.NextFunction) {
    try {

      let seconds: number = +req.params.seconds
      res.json(await this.player.addTime(seconds))

    } catch (error) {
      next(error)
    }
  }

  private async setVideoTrack (req: express.Request, res: express.Response, next: express.NextFunction) {
    try {

      let id: number = +req.params.id
      res.json(await this.player.setVideoTrack(id))

    } catch (error) {
      next(error)
    }
  }

  private async setAudioTrack (req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
    
      let id: number = +req.params.id
      res.json(await this.player.setAudioTrack(id))

    } catch (error) {
      next(error)
    }
  }

  private async setSubtitleTrack (req: express.Request, res: express.Response, next: express.NextFunction) {
    try {

      let id: number = +req.params.id
      res.json(await this.player.setSubtitleTrack(id))

    } catch (error) {
      next(error)
    }
  }

  private todo (req: express.Request, res: express.Response, next: express.NextFunction) {
    logger.debug('Not yet implemented')
    return res.send('Not yet implemented').status(501).end()
  }

}

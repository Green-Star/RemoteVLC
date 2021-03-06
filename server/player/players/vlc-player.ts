import * as child_process from 'child_process'

import * as Utils from '../../utils'
import { Context, Player } from '../common'
import { Task } from '../../task'
import { logger } from '../../logger'
import { PlayerMethods } from '../../models'
import { Track, PlayerData } from '../../../shared'

class MethodResult {
  result: boolean;
  data: string;
}

class ParseTracksResult {
  returnedResult: boolean;
  remainingData: string;
  tracks: Track[];
}

const METHODS = {
  INIT: 'init',
  PAUSE: 'pause',
  SET_TIME: 'setTime',
  GET_TIME: 'getTime',
  GET_TITLE: 'getTitle',
  GET_LENGTH: 'getLength',
  SET_VOLUME: 'setVolume',
  GET_VOLUME: 'getVolume',
  MODIFY_VOLUME: 'modifyVolume',
  SET_VIDEO_TRACK: 'setVideoTrack',
  GET_VIDEO_TRACKS: 'getVideoTracks',
  SET_AUDIO_TRACK: 'setAudioTrack',
  GET_AUDIO_TRACKS: 'getAudioTracks',
  SET_SUBTITLE_TRACK: 'setSubtitleTrack',
  GET_SUBTITLE_TRACKS: 'getSubtitleTracks'
}

export class VLCPlayer extends Player {
  private spawnService: { (command: string, args?: ReadonlyArray<string>, options?: child_process.SpawnOptions): child_process.ChildProcess }
  private context: Context
  private tasks: Task[]
  private data: string
  private internalMethods: { (data: string): MethodResult } []
  private vlcProcess: child_process.ChildProcess


  constructor (
    filename: string,
    spawnService: { (command: string, args?: ReadonlyArray<string>, options?: child_process.SpawnOptions): child_process.ChildProcess },
    context: Context,
    tasks: Task[],
    data: string
  ) {
    super(filename)
    this.vlcProcess = undefined
    this.internalMethods = []
    this.setInternalMethods()
    this.spawnService = spawnService
    this.context = context
    this.tasks = tasks
    this.data = data
  }

  public async start (): Promise<void> {
    /* Spawn VLC process */
    this.vlcProcess = this.spawnService('vlc',
              [ this.filename, '--fullscreen', '--play-and-exit', '-I rc' ])
    
    /* VLC spawns in playing mode by default */
    this.context.startPlaying()

    /* Record player's stdout callback function */
    this.vlcProcess.stdout.setEncoding('utf8')
    this.vlcProcess.stdout.on('data', (data: Buffer) => this.handleServerFeedback(this.tasks, data))

    let task = new Task(METHODS.INIT)

    this.tasks.push(task)

    /* Once INIT has finish, we let VLC initialize its stuff, and then we send 'pause' and get the media informations */
    await task
    await this.initializeVLC()
    await this.pause()
    await this.getMediaInformations()
    return
  }

  public getMediaInformations (): Promise<PlayerData[]> {
    return Promise.all([
      this.getTitle(),
      this.getLength(),
      this.getTime(),
      this.getVolume(),
      this.getVideoTracks(),
      this.getAudioTracks(),
      this.getSubtitleTracks()
    ])
  }

  public pause (): Promise<PlayerData> {
    let task = new Task(METHODS.PAUSE)

    this.tasks.push(task)
    this.vlcProcess.stdin.write('pause\r\n')

    return task
  }

  public play (): Promise<PlayerData> {
    return this.pause()
  }

  public setTime (time: number): Promise<PlayerData> {
    let length = this.context.getLength()

    /* Be sure to stay in the media's time */
    if (time < 0) time = 0
    if (time > length) time = length

    /* If we try to set time to the current value, there's no need to do anything,
      so we just return an immediately resolved promise */
    if (time === this.context.getTime()) {
      return Utils.resolvedPromise(this.context.toFormattedPlayerData())
    }

    let task = new Task(METHODS.SET_TIME)

    this.tasks.push(task)
    this.vlcProcess.stdin.write('seek ' + time + '\r\n')
    this.context.setTime(time)

    return task
  }

  public getTime (): Promise<PlayerData> {
    let task = new Task(METHODS.GET_TIME)

    this.tasks.push(task)
    this.vlcProcess.stdin.write('get_time\r\n')

    return task
  }

  public addTime (seconds: number): Promise<PlayerData> {
    let time: number = this.context.getTime() + seconds

    return this.setTime(time)
  }

  public getTitle (): Promise<PlayerData> {
    let task = new Task(METHODS.GET_TITLE)

    this.tasks.push(task)
    this.vlcProcess.stdin.write('get_title\r\n')

    return task
  }

  public getLength (): Promise<PlayerData> {
    let task = new Task(METHODS.GET_LENGTH)

    this.tasks.push(task)
    this.vlcProcess.stdin.write('get_length\r\n')

    return task
  }

  public setVolume (volume: number): Promise<PlayerData> {
    let task = new Task(METHODS.SET_VOLUME)

    this.tasks.push(task)
    this.vlcProcess.stdin.write('volume ' + volume + '\r\n')
    this.context.setVolume(volume)

    return task
  }

  public getVolume (): Promise<PlayerData> {
    let task = new Task(METHODS.GET_VOLUME)

    this.tasks.push(task)
    this.vlcProcess.stdin.write('volume\r\n')

    return task
  }

  public volumeUp (): Promise<PlayerData> {
    let task = new Task(METHODS.MODIFY_VOLUME)

    this.tasks.push(task)
    this.vlcProcess.stdin.write('volup\r\n')

    return task
  }

  public volumeDown (): Promise<PlayerData> {
    let task = new Task(METHODS.MODIFY_VOLUME)

    this.tasks.push(task)
    this.vlcProcess.stdin.write('voldown\r\n')

    return task
  }

  public mute (): Promise<PlayerData> {
    return this.setVolume(0)
  }

  public setVideoTrack (trackId: number): Promise<PlayerData> {
    /* If the new selected track does not exist, immediately return an already fulfilled promise */
    let updated = this.context.setSelectedVideoTrack(trackId)
    if (updated === false) return Utils.resolvedPromise(this.context.toFormattedPlayerData())

    let task = new Task(METHODS.SET_VIDEO_TRACK)

    this.tasks.push(task)
    this.vlcProcess.stdin.write('vtrack ' + trackId + '\r\n')

    return task
  }

  public getVideoTracks (): Promise<PlayerData> {
    let task = new Task(METHODS.GET_VIDEO_TRACKS)

    this.tasks.push(task)
    this.vlcProcess.stdin.write('vtrack\r\n')

    return task
  }

  public setAudioTrack (trackId: number): Promise<PlayerData> {
    /* If the new selected track does not exist, immediately return an already fulfilled promise */
    let updated = this.context.setSelectedAudioTrack(trackId)
    if (updated === false) return Utils.resolvedPromise(this.context.toFormattedPlayerData())

    let task = new Task(METHODS.SET_AUDIO_TRACK)

    this.tasks.push(task)
    this.vlcProcess.stdin.write('atrack ' + trackId + '\r\n')

    return task
  }

  public getAudioTracks (): Promise<PlayerData> {
    let task = new Task(METHODS.GET_AUDIO_TRACKS)

    this.tasks.push(task)
    this.vlcProcess.stdin.write('atrack\r\n')

    return task
  }

  public setSubtitleTrack (trackId: number): Promise<PlayerData> {
    /* If the new selected track does not exist, immediately return an already fulfilled promise */
    let updated = this.context.setSelectedSubtitleTrack(trackId)
    if (updated === false) return Utils.resolvedPromise(this.context.toFormattedPlayerData())

    let task = new Task(METHODS.SET_SUBTITLE_TRACK)

    this.tasks.push(task)
    this.vlcProcess.stdin.write('strack ' + trackId + '\r\n')

    return task
  }

  public getSubtitleTracks (): Promise<PlayerData> {
    let task = new Task(METHODS.GET_SUBTITLE_TRACKS)

    this.tasks.push(task)
    this.vlcProcess.stdin.write('strack\r\n')

    return task
  }

  private sanitizeServerFeedback (bufferData: string): string {
    /* Sanitize server feedback */
    /* (remove every '> ') */
    return bufferData.replace(new RegExp(/> /, 'g'), '')
  }

  private handleServerFeedback (tasksToDo: Task[], data: Buffer): void {
    logger.verbose('=== Start handleServerFeedback ===')

    let buffer = ''
    /* Bufferize the data and consume it whenever needed */
    for (let c of data) {
      buffer += c
    }

    logger.debug('Original data: [' + buffer + ']')
    let sanitizedData = this.sanitizeServerFeedback(buffer)
    logger.debug('Sanitized data: ['+ sanitizedData + ']')
    this.data += sanitizedData

    let pendingTasks = tasksToDo.slice()
    let pendingData = this.data
    logger.debug('Tasks to do: ' + JSON.stringify(pendingTasks))
    logger.debug('Data: ' + JSON.stringify(pendingData))

    for (let task of tasksToDo) {
      logger.debug('Execute: ' + task.getName())

      let end = this.internalMethods[task.getName()](pendingData)
      if (end.result === false) break

      /* If the function succeeded we can remove it from the pending tasks */
      pendingTasks.shift()
      /* And it has consume the relevant data, so we remove them too */
      pendingData = end.data
      /* And we resolve the promise */
      task.resolve(this.context.toFormattedPlayerData())
    }

    this.tasks = pendingTasks
    this.data = pendingData

    logger.verbose('Pending tasks: ' + JSON.stringify(this.tasks))
    logger.verbose('Pending data: ' + JSON.stringify(this.data))
    logger.verbose('===  End  handleServerFeedback ===')
  }

  private parseTracks (data: string): ParseTracksResult {
    let parsedTracks: Track[] = []
    let result = false
    let regexp = new RegExp(/(\+-{4}\[ (spu|audio|video)-es \]\r\n)/)
    let matchedData: RegExpMatchArray = data.match(regexp)

    if (!matchedData || !matchedData[1] || !matchedData[2]) return { returnedResult: false, remainingData: data, tracks: parsedTracks }

    let safeguard = '+----[ end of ' + matchedData[2] + '-es ]\r\n'
    let pos = data.indexOf(safeguard)
    if (pos === -1) return { returnedResult: false, remainingData: data, tracks: parsedTracks }

    let tracksData = data.substr(matchedData[1].length, pos - matchedData[1].length)
    let remainingData = data.substr(pos + safeguard.length)
    result = true

    let subRegex = new RegExp(/\|\s(-?\d+)\s-(?:\s(.*)\s-)?\s(?:\[(.+)\]|([^*\r\n]+))(?:\s(\*?))?\r\n/, 'g')
    let tracks: RegExpMatchArray
    while ((tracks = subRegex.exec(tracksData))) {
      let trackInfo: Track
      trackInfo = { id: undefined, title: undefined, language: undefined, selected: undefined }
      trackInfo.id = +tracks[1]
      trackInfo.title = tracks[2]
      trackInfo.language = (tracks[3]) ? tracks[3] : tracks[4]
      trackInfo.selected = (tracks[5]) ? true : false

      logger.debug(JSON.stringify(trackInfo))

      parsedTracks.push(trackInfo)
    }

    return { returnedResult: result, remainingData: remainingData, tracks: parsedTracks }
  }

  private async initializeVLC (): Promise<void> {
    do {
      let result = await this.getTitle()

      if (result && result.title) {
        logger.info('VLC initialized')
        break
      }

      await Utils.delay(100)
    } while (true)

    return
  }

  private setInternalMethods (): void {
    /* We'll use Instance Functions here to preserve this binding 
      (see: https://github.com/Microsoft/TypeScript/wiki/'this'-in-TypeScript)
    */
    this.internalMethods[METHODS.INIT] = (data: string) => this.internalInit(data)
    this.internalMethods[METHODS.PAUSE] = (data: string) => this.internalPause(data)
    this.internalMethods[METHODS.GET_TITLE] = (data: string) => this.internalGetTitle(data)
    this.internalMethods[METHODS.SET_TIME] = (data: string) => this.internalSetTime(data)
    this.internalMethods[METHODS.GET_TIME] = (data: string) => this.internalGetTime(data)
    this.internalMethods[METHODS.GET_LENGTH] = (data: string) => this.internalGetLength(data)
    this.internalMethods[METHODS.SET_VOLUME] = (data: string) => this.internalSetVolume(data)
    this.internalMethods[METHODS.GET_VOLUME] = (data: string) => this.internalGetVolume(data)
    this.internalMethods[METHODS.MODIFY_VOLUME] = (data: string) => this.internalModifyVolume(data)
    this.internalMethods[METHODS.SET_VIDEO_TRACK] = (data: string) => this.internalSetVideoTrack(data)
    this.internalMethods[METHODS.GET_VIDEO_TRACKS] = (data: string) => this.internalGetVideoTracks(data)
    this.internalMethods[METHODS.SET_AUDIO_TRACK] = (data: string) => this.internalSetAudioTrack(data)
    this.internalMethods[METHODS.GET_AUDIO_TRACKS] = (data: string) => this.internalGetAudioTracks(data)
    this.internalMethods[METHODS.SET_SUBTITLE_TRACK] = (data: string) => this.internalSetSubtitleTrack(data)
    this.internalMethods[METHODS.GET_SUBTITLE_TRACKS] = (data: string) => this.internalGetSubtitleTracks(data)
  }

  /*** --------------------------------------------------- ***

                     INTERNAL METHODS

  *** --------------------------------------------------- ***/
  private internalInit (data: string): MethodResult {
    let safeguard = "Command Line Interface initialized. Type `help' for help.\r\n"

    let returnedResult = false
    let returnedData = data

    let pos = data.indexOf(safeguard)
    if (pos > -1) {
      returnedResult = true
      returnedData = data.substr(pos + safeguard.length)
    }

    return { result: returnedResult, data: returnedData }
  }

  private internalPause (data: string): MethodResult {
    let returnedData = data

    if (this.context.isPlaying()) {
      this.context.stopPlaying()
    } else {
      this.context.startPlaying()
    }

    return { result: true, data: returnedData }
  }

  private internalGetTitle (data: string) {
    let safeguard = "\r\n"

    let returnedResult = false
    let returnedData = data

    let pos = data.indexOf(safeguard)
    if (pos > -1) {
      let title = data.substr(0, pos)
      this.context.setTitle(title)

      returnedResult = true
      returnedData = data.substr(pos + safeguard.length)

      logger.debug('Title: ' + this.context.getTitle())
    }

    return { result: returnedResult, data: returnedData }
  }

  private internalSetTime (data: string) {
    logger.debug('Time: ' + this.context.getTime())
    return { result: true, data: data }
  }

  private internalGetTime (data: string) {
    let safeguard = "\r\n"

    let returnedResult = false
    let returnedData = data

    let pos = data.indexOf(safeguard)
    if (pos > -1) {
      let time = +(data.substr(0, pos))
      this.context.setTime(time)

      returnedResult = true
      returnedData = data.substr(pos + safeguard.length)

      logger.debug('Current time: ' + this.context.getTime())
    }

    return { result: returnedResult, data: returnedData }
  }

  private internalGetLength (data: string) {
    let safeguard = "\r\n"

    let returnedResult = false
    let returnedData = data

    let pos = data.indexOf(safeguard)
    if (pos > -1) {
      let length = +(data.substr(0, pos))
      this.context.setLength(length)

      returnedResult = true
      returnedData = data.substr(pos + safeguard.length)

      logger.debug('Media length: ' + this.context.getLength())
    }

    return { result: returnedResult, data: returnedData }
  }

  private internalSetVolume (data: string) {
    logger.debug('Set Volume: ' + this.context.getVolume())
    return { result: true, data: data }
  }

  private internalGetVolume (data: string) {
    let safeguard = "\r\n"

    let returnedResult = false
    let returnedData = data

    let pos = data.indexOf(safeguard)
    if (pos > -1) {
      let volume = parseInt(data.substr(0, pos))
      this.context.setVolume(volume)

      returnedResult = true
      returnedData = data.substr(pos + safeguard.length)

      logger.debug('Volume: ' + this.context.getVolume())
    }

    return { result: returnedResult, data: returnedData }
  }

  private internalModifyVolume (data: string) {
    let returnedResult = false
    let returnedData = data

    let regexp = new RegExp(/^\( audio volume: (\d+)(?:,|.\d+)? \)\r\n/)
    let matching = data.match(regexp)

    if (matching && matching[0] && matching[1]) {
      let volume = +matching[1]
      this.context.setVolume(volume)

      returnedResult = true
      returnedData = data.substr(matching[0].length)

      logger.debug('Volume: ' + this.context.getVolume())
    }

    return { result: returnedResult, data: returnedData }
  }

  private internalSetVideoTrack (data: string) {
    logger.debug('Set Video track: ' + JSON.stringify(this.context.getVideoTracks()))
    return { result: true, data: data }
  }

  private internalGetVideoTracks (data: string) {
    let result: ParseTracksResult = this.parseTracks(data)

    this.context.setVideoTracks(result.tracks)

    logger.debug('Video tracks: ' + JSON.stringify(this.context.getVideoTracks()))

    return { result: result.returnedResult, data: result.remainingData }
  }

  private internalSetAudioTrack (data: string) {
    logger.debug('Set Audio track: ' + JSON.stringify(this.context.getAudioTracks()))
    return { result: true, data: data }
  }

  private internalGetAudioTracks (data: string) {
    let result: ParseTracksResult = this.parseTracks(data)

    this.context.setAudioTracks(result.tracks)

    logger.debug('Audio tracks: ' + JSON.stringify(this.context.getAudioTracks()))

    return { result: result.returnedResult, data: result.remainingData }
  }

  private internalSetSubtitleTrack (data: string) {
    logger.debug('Set Subtitle track: ' + JSON.stringify(this.context.getSubtitleTracks()))
    return { result: true, data: data }
  }

  private internalGetSubtitleTracks (data: string) {
    let result: ParseTracksResult = this.parseTracks(data)

    this.context.setSubtitleTracks(result.tracks)

    logger.debug('Subtitles tracks: ' + JSON.stringify(this.context.getSubtitleTracks()))

    return { result: result.returnedResult, data: result.remainingData }
  }

}

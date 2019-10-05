import * as Utils from '../../utils'
import { Context, Player } from '../common'
import { PlayerMethods } from '../../models'
import { Track, PlayerData } from '../../../shared'

export class MockPlayer extends Player {
  private context: Context

  constructor (
    filename: string,
    context: Context
  ) {
    super(filename)
    this.context = context
  }

  public start (): Promise<void> {
    let mockData = {
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

    this.context.setTitle(mockData.title)
    this.context.setPlaying(mockData.isPlaying)
    this.context.setVolume(mockData.volume)
    this.context.setTime(mockData.time)
    this.context.setLength(mockData.length)
    this.context.setVideoTracks(mockData.tracks.video)
    this.context.setAudioTracks(mockData.tracks.audio)
    this.context.setSubtitleTracks(mockData.tracks.subtitle)

    return Utils.resolvedPromise()
  }

  public getMediaInformations (): Promise<PlayerData[]> {
    let result: PlayerData[] = []

    result.push(this.context.toFormattedPlayerData())

    return Utils.resolvedPromise(result)
  }

  public pause (): Promise<PlayerData> {
    this.context.setPlaying(false)
    this.context.stopTimer()
    return Utils.resolvedPromise(this.context.toFormattedPlayerData())
  }

  public play (): Promise<PlayerData> {
    this.context.setPlaying(true)
    this.context.startTimer()
    return Utils.resolvedPromise(this.context.toFormattedPlayerData())
  }

  public setTime (time: number): Promise<PlayerData> {
    if (time < 0) time = 0
    if (time > this.context.getLength()) time = this.context.getLength()

    this.context.setTime(time)
    return Utils.resolvedPromise(this.context.toFormattedPlayerData())
  }

  public getTime (): Promise<PlayerData> {
    return Utils.resolvedPromise(this.context.toFormattedPlayerData())
  }

  public addTime (seconds: number): Promise<PlayerData> {
    return this.setTime(this.context.getTime() + seconds)
  }

  public getTitle (): Promise<PlayerData> {
    return Utils.resolvedPromise(this.context.toFormattedPlayerData())
  }

  public getLength (): Promise<PlayerData> {
    return Utils.resolvedPromise(this.context.toFormattedPlayerData())
  }

  public setVolume (volume: number): Promise<PlayerData> {
    if (volume < 0) volume = 0
    this.context.setVolume(volume)
    return Utils.resolvedPromise(this.context.toFormattedPlayerData())
  }

  public getVolume (): Promise<PlayerData> {
    return Utils.resolvedPromise(this.context.toFormattedPlayerData())
  }

  public volumeUp (): Promise<PlayerData> {
    return this.setVolume(this.context.getVolume() + 10)
  }

  public volumeDown (): Promise<PlayerData> {
    return this.setVolume(this.context.getVolume() - 10)
  }

  public mute (): Promise<PlayerData> {
    return this.setVolume(0)
  }

  public setVideoTrack (trackId: number):  Promise<PlayerData> {
    this.context.setSelectedVideoTrack(trackId)
    return Utils.resolvedPromise(this.context.toFormattedPlayerData())
  }

  public getVideoTracks (): Promise<PlayerData> {
    return Utils.resolvedPromise(this.context.toFormattedPlayerData())
  }

  public setAudioTrack (trackId: number): Promise<PlayerData> {
    this.context.setSelectedAudioTrack(trackId)
    return Utils.resolvedPromise(this.context.toFormattedPlayerData())
  }

  public getAudioTracks (): Promise<PlayerData> {
    return Utils.resolvedPromise(this.context.toFormattedPlayerData())
  }

  public setSubtitleTrack (trackId: number): Promise<PlayerData> {
    this.context.setSelectedSubtitleTrack(trackId)
    return Utils.resolvedPromise(this.context.toFormattedPlayerData())
  }

  public getSubtitleTracks (): Promise<PlayerData> {
    return Utils.resolvedPromise(this.context.toFormattedPlayerData())
  }
}

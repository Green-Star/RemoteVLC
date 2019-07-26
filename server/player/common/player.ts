import { PlayerData } from '../../../shared'
import { PlayerMethods } from '../../models'

export abstract class Player implements PlayerMethods {
  protected filename: string

  constructor (filename: string) {
    this.filename = filename
  }

  abstract start (): Promise<void | PlayerData>;
  abstract getMediaInformations (): Promise<PlayerData[]>;
  abstract pause (): Promise<PlayerData>;
  abstract play (): Promise<PlayerData>;
  abstract setTime (time: number): Promise<PlayerData>;
  abstract getTime (): Promise<PlayerData>;
  abstract addTime (seconds: number): Promise<PlayerData>;
  abstract getTitle (): Promise<PlayerData>;
  abstract getLength (): Promise<PlayerData>;
  abstract setVolume (volume: number): Promise<PlayerData>;
  abstract getVolume (): Promise<PlayerData>;
  abstract volumeUp (): Promise<PlayerData>;
  abstract volumeDown (): Promise<PlayerData>;
  abstract mute (): Promise<PlayerData>;
  abstract setVideoTrack (trackId: number): Promise<PlayerData>;
  abstract getVideoTracks (): Promise<PlayerData>;
  abstract setAudioTrack (trackId: number): Promise<PlayerData>;
  abstract getAudioTracks (): Promise<PlayerData>;
  abstract setSubtitleTrack (trackId: number): Promise<PlayerData>;
  abstract getSubtitleTracks (): Promise<PlayerData>;
}

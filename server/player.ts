import { PlayerData } from './player-data.model'
import { PlayerMethods } from './player-methods.model'

export abstract class Player implements PlayerMethods {
  protected filename: string

  constructor (filename: string) {
    this.filename = filename
  }

  abstract start (): void;
  abstract getMediaInformations (): Promise<PlayerData[]>;
  abstract pause (): Promise<PlayerData>;
  abstract play (): Promise<PlayerData>;
  abstract setTime (time: number): Promise<PlayerData>;
  abstract getTime (): Promise<PlayerData>;
  abstract getTitle (): Promise<PlayerData>;
  abstract getLength (): Promise<PlayerData>;
  abstract setVolume (volume: number): Promise<PlayerData>;
  abstract getVolume (): Promise<PlayerData>;
  abstract volumeUp (): Promise<PlayerData>;
  abstract volumeDown (): Promise<PlayerData>;
  abstract mute (): Promise<PlayerData>;
  abstract setVideoTrack (trackId): Promise<PlayerData>;
  abstract getVideoTracks (): Promise<PlayerData>;
  abstract setAudioTrack (trackId): Promise<PlayerData>;
  abstract getAudioTracks (): Promise<PlayerData>;
  abstract setSubtitleTrack (trackId): Promise<PlayerData>;
  abstract getSubtitleTracks (): Promise<PlayerData>;
}

import { PlayerData } from '../../../shared'

export interface PlayerMethods {
  start: () => Promise<void | PlayerData>;
  getMediaInformations: () => Promise<PlayerData[]>;
  pause: () => Promise<PlayerData>;
  play: () => Promise<PlayerData>;
  setTime: (time: number) => Promise<PlayerData>;
  getTime: () => Promise<PlayerData>;
  addTime: (seconds: number) => Promise<PlayerData>;
  getTitle: () => Promise<PlayerData>;
  getLength: () => Promise<PlayerData>;
  setVolume: (volume: number) => Promise<PlayerData>;
  getVolume: () => Promise<PlayerData>;
  volumeUp: () => Promise<PlayerData>;
  volumeDown: () => Promise<PlayerData>;
  mute: () => Promise<PlayerData>;
  setVideoTrack: (trackId: number) => Promise<PlayerData>;
  getVideoTracks: () => Promise<PlayerData>;
  setAudioTrack: (trackId: number) => Promise<PlayerData>;
  getAudioTracks: () => Promise<PlayerData>;
  setSubtitleTrack: (trackId: number) => Promise<PlayerData>;
  getSubtitleTracks: () => Promise<PlayerData>;
}

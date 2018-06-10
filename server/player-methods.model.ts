import { PlayerData } from './player-data.model'

export interface PlayerMethods {
  start: (playerName: string, filename: string) => void;
  getMediaInformations: () => Promise<PlayerData[]>;
  pause: () => Promise<PlayerData>;
  play: () => Promise<PlayerData>;
  setTime: (time: number) => Promise<PlayerData>;
  getTime: () => Promise<PlayerData>;
  getTitle: () => Promise<PlayerData>;
  getLength: () => Promise<PlayerData>;
  setVolume: (volume: number) => Promise<PlayerData>;
  getVolume: () => Promise<PlayerData>;
  volumeUp: () => Promise<PlayerData>;
  volumeDown: () => Promise<PlayerData>;
  mute: () => Promise<PlayerData>;
  setVideoTrack: (trackId) => Promise<PlayerData>;
  getVideoTracks: () => Promise<PlayerData>;
  setAudioTrack: (trackId) => Promise<PlayerData>;
  getAudioTracks: () => Promise<PlayerData>;
  setSubtitleTrack: (trackId) => Promise<PlayerData>;
  getSubtitleTracks: () => Promise<PlayerData>;
}

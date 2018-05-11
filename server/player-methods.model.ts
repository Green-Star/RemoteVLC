import { PlayerData } from './player-data.model'

/*
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
*/

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

  test: () => void
}

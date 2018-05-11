import { Track } from './track.model'

import { PlayerData } from './player-data.model'
import { PlayerMethods } from './player-methods.model'

export interface FormattedPlayer {
  title: string;
  isPlaying: boolean;
  volume: number;
  time: number;
  length: number;
  tracks: {
    video: Track[];
    audio: Track[];
    subtitle: Track[];
  };
}

export interface Player extends PlayerData, PlayerMethods { }
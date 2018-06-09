import { Track } from './track.model'

export interface PlayerData {
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
  timer: NodeJS.Timer;
}
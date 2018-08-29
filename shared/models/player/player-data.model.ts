import { Track } from '../track'

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
}

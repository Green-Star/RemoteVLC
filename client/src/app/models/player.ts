import { Track } from './track'

export class Player {
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
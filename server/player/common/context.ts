import { Track, PlayerData } from '../../../shared'

import { logger } from '../../logger'

export class Context {
  private playerData: PlayerData
  private timer: NodeJS.Timer;

  constructor () {
    this.playerData = {
      title: '',
      isPlaying: false,
      volume: 0,
      time: 0,
      length: 0,
      tracks: {
        video: [],
        audio: [],
        subtitle: []
      }
    }
    this.timer = undefined
  }

  public getTitle (): string {
    return this.playerData.title
  }

  public setTitle (title: string): void {
    this.playerData.title = title
  }

  public isPlaying (): boolean {
    return this.playerData.isPlaying
  }

  public setPlaying (isPlaying: boolean): void {
    this.playerData.isPlaying = isPlaying
  }

  public getVolume (): number {
    return this.playerData.volume
  }

  public setVolume (volume: number): void {
    this.playerData.volume = volume
  }

  public getTime (): number {
    return this.playerData.time
  }

  public setTime (time: number): void {
    this.playerData.time = time
  }

  public getLength (): number {
    return this.playerData.length
  }

  public setLength (length: number): void {
    this.playerData.length = length
  }

  public getVideoTracks (): Track[] {
    return this.playerData.tracks.video
  }

  public setVideoTracks (videoTracks: Track[]): void {
    this.playerData.tracks.video = videoTracks
  }

  public setSelectedVideoTrack (newSelectedTrackId: number): boolean {
    return this.updateVideoTrack(newSelectedTrackId)
  }

  public getAudioTracks (): Track[] {
    return this.playerData.tracks.audio
  }

  public setAudioTracks (audioTracks: Track[]): void {
    this.playerData.tracks.audio = audioTracks
  }

  public setSelectedAudioTrack (newSelectedTrackId: number): boolean {
    return this.updateAudioTrack(newSelectedTrackId)
  }

  public getSubtitleTracks (): Track[] {
    return this.playerData.tracks.subtitle
  }

  public setSubtitleTracks (subtitleTracks: Track[]): void {
    this.playerData.tracks.subtitle = subtitleTracks
  }

  public setSelectedSubtitleTrack (newSelectedTrackId: number): boolean {
    return this.updateSubtitleTrack(newSelectedTrackId)
  }

  public startTimer (): void {
    this.timer = setInterval(() => this.updateSeconds(), 1000)
  }

  public stopTimer (): void {
    clearInterval(this.timer)
  }

  public startPlaying(): void {
    this.setPlaying(true)
    this.startTimer()
  }

  public stopPlaying(): void {
    this.setPlaying(false)
    this.stopTimer()
  }

  public toFormattedPlayerData(): PlayerData {
    return {
      title: this.playerData.title,
      isPlaying: this.playerData.isPlaying,
      volume: this.playerData.volume,
      time: this.playerData.time,
      length: this.playerData.length,
      tracks: {
        video: this.playerData.tracks.video,
        audio: this.playerData.tracks.audio,
        subtitle: this.playerData.tracks.subtitle
      }
    }
  }

  private updateSeconds(): void {
    this.playerData.time++
    logger.debug('Media time: ' + this.playerData.time)
  }

  private getOldTrackIndex (tracks: Track[]): number {
    return tracks.findIndex(track => track.selected === true)
  }

  private getNewTrackIndex (tracks: Track[], trackId: number): number {
    return tracks.findIndex(track => track.id === trackId)
  }

  private updateTrack (tracks: Track[], newTrackId: number): boolean {
    let oldTrackIndex = this.getOldTrackIndex(tracks)
    let newTrackIndex = this.getNewTrackIndex(tracks, newTrackId)
    /* If one of the index is not valid, stop here */
    if (oldTrackIndex === -1 || newTrackIndex === -1) return false

    tracks[oldTrackIndex].selected = false
    tracks[newTrackIndex].selected = true

    return true
  }

  private updateVideoTrack(newTrackId: number): boolean {
    return this.updateTrack(this.playerData.tracks.video, newTrackId)
  }

  private updateAudioTrack(newTrackId: number): boolean {
    return this.updateTrack(this.playerData.tracks.audio, newTrackId)
  }

  private updateSubtitleTrack(newTrackId: number): boolean {
    return this.updateTrack(this.playerData.tracks.subtitle, newTrackId)
  }
}

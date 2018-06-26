import { Component, OnInit, ViewChild } from '@angular/core'
import { PlayerData, Track } from '../../../../shared'
import { PlayerService } from '../service'
import { TimerComponent } from '../timer/timer.component'
import { TrackComponent } from '../track/track.component'

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {
  player: PlayerData
  selectedVideoTrack: Track
  selectedAudioTrack: Track
  selectedSubtitleTrack: Track
  @ViewChild(TimerComponent) timerComponent: TimerComponent

  constructor(private playerService : PlayerService) {}

  ngOnInit() {
    this.player = undefined
    this.playerService.init().subscribe(data => this.updatePlayerData(data))
  }

  updatePlayerData(data: PlayerData) {
      this.player = data
      this.selectedVideoTrack = this.getSelectedVideoTrack()
      this.selectedAudioTrack = this.getSelectedAudioTrack()
      this.selectedSubtitleTrack = this.getSelectedSubtitleTrack()
      if (this.timerComponent === undefined) return
      this.timerComponent.updateTimer(this.player.time)
  }

  getSelectedVideoTrack() {
    return this.player.tracks['video'].find(track => track.selected === true)
  }
  setSelectedVideoTrack(newTrack: Track) {
    this.selectedVideoTrack = newTrack
    this.setTrack('video', newTrack)
  }
  getSelectedAudioTrack() {
    return this.player.tracks['audio'].find(track => track.selected === true)
  }
  setSelectedAudioTrack(newTrack: Track) {
    this.selectedAudioTrack = newTrack
    this.setTrack('audio', newTrack)
  }
  getSelectedSubtitleTrack() {
    return this.player.tracks['subtitle'].find(track => track.selected === true)
  }
  setSelectedSubtitleTrack(newTrack: Track) {
    this.selectedSubtitleTrack = newTrack
    this.setTrack('subtitle', newTrack)
  }

  isPlaying() {
    return this.player.isPlaying
  }
  pause() {
    this.playerService.pause().subscribe(data => {
      this.updatePlayerData(data)
      this.timerComponent.stopTimer()
    })
  }
  play() {
    this.playerService.play().subscribe(data => {
      this.updatePlayerData(data)
      this.timerComponent.startTimer()
    })
  }
  setTime(seconds: number) {
    if (seconds < 0) seconds = 0
    if (seconds > this.player.length) seconds = this.player.length
    this.playerService.setTime(seconds).subscribe(data => this.updatePlayerData(data))
  }
  addTime(seconds: number) {
    this.playerService.addTime(seconds).subscribe(data => this.updatePlayerData(data))
  }

  volumeDown() {
    this.playerService.volumeDown().subscribe(data => this.updatePlayerData(data))
  }
  volumeUp() {
    this.playerService.volumeUp().subscribe(data => this.updatePlayerData(data))
  }
  setVolume(volume: number) {
    this.playerService.setVolume(volume).subscribe(data => this.updatePlayerData(data))
  }

  setTrack(type: string, track: Track) {
    this.playerService.setTrack(type, track.id).subscribe(data => this.updatePlayerData(data))
  }
}

import { Component, OnInit } from '@angular/core'
import { PlayerService } from '../service'
import { Player, Track } from '../models'

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {
  player: Player
  selectedVideoTrack: Track
  selectedAudioTrack: Track
  selectedSubtitleTrack: Track

  constructor(private playerService : PlayerService) {}

  ngOnInit() {
    this.player = undefined
    this.playerService.init().subscribe(data => this.updatePlayerData(data))
  }

  updatePlayerData(data: Player) {
      this.player = data
      this.selectedVideoTrack = this.getSelectedVideoTrack()
      this.selectedAudioTrack = this.getSelectedAudioTrack()
      this.selectedSubtitleTrack = this.getSelectedSubtitleTrack()
  }

  debug() {
  	console.log(JSON.stringify(this.player))
  }

  getSelectedVideoTrack() {
    return this.player.tracks['video'].find(track => track.selected === true)
  }
  setSelectedVideoTrack(newTrack: Track) {
    this.selectedVideoTrack = newTrack
    this.playerService.setTrack('video', newTrack)
  }
  getSelectedAudioTrack() {
    return this.player.tracks['audio'].find(track => track.selected === true)
  }
  setSelectedAudioTrack(newTrack: Track) {
    this.selectedAudioTrack = newTrack
    this.playerService.setTrack('audio', newTrack)
  }
  getSelectedSubtitleTrack() {
    return this.player.tracks['subtitle'].find(track => track.selected === true)
  }
  setSelectedSubtitleTrack(newTrack: Track) {
    this.selectedSubtitleTrack = newTrack
    this.playerService.setTrack('subtitle', newTrack)
  }

  isPlaying() {
    return this.player.isPlaying
  }
  pause() {
    this.playerService.pause()
  }
  play() {
    this.playerService.play()
  }
  setTime(seconds: number) {
    if (seconds < 0) seconds = 0
    this.player.time = seconds
    this.playerService.setTime(seconds)
  }
  addTime(seconds: number) {
    this.setTime(this.player.time + seconds)
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
}

import { Component, OnInit, ViewChild } from '@angular/core'
import { PlayerData, Track } from '../../../../shared'
import { PlayerService } from '../service'
import { TimerComponent } from '../timer/timer.component'
import { TrackComponent } from '../track/track.component'
import { Subscription, Observable } from 'rxjs'

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {
  player: PlayerData
  @ViewChild(TimerComponent) timerComponent: TimerComponent

  @ViewChild('video') videoTrackComponent: TrackComponent
  @ViewChild('audio') audioTrackComponent: TrackComponent
  @ViewChild('subtitle') subtitleTrackComponent: TrackComponent

  constructor(private playerService : PlayerService) {}

  ngOnInit() {
    this.player = undefined
    this.playerService.init().subscribe(data => this.updatePlayerData(data))
  }

  updatePlayerData(data: PlayerData) {
      this.player = data

      if (this.timerComponent) this.timerComponent.updateTimer(this.player.time)
      if (this.videoTrackComponent) this.videoTrackComponent.setTracks(this.player.tracks.video)
      if (this.audioTrackComponent) this.audioTrackComponent.setTracks(this.player.tracks.audio)
      if (this.subtitleTrackComponent) this.subtitleTrackComponent.setTracks(this.player.tracks.subtitle)
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
}

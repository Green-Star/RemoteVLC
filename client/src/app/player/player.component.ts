import { Component, OnInit, AfterViewInit, AfterViewChecked, ViewChild } from '@angular/core'
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
export class PlayerComponent implements OnInit, AfterViewInit, AfterViewChecked {
  player: PlayerData
  selectedVideoTrack: Track
  selectedAudioTrack: Track
  selectedSubtitleTrack: Track
  @ViewChild(TimerComponent) timerComponent: TimerComponent

  trackComponentSubscription: Subscription

  @ViewChild('video') videoTrackComponent: TrackComponent
  @ViewChild('audio') audioTrackComponent: TrackComponent
  @ViewChild('subtitle') subtitleTrackComponent: TrackComponent

  constructor(private playerService : PlayerService) {}

  ngOnInit() {
    this.player = undefined
    this.playerService.init().subscribe(data => this.updatePlayerData(data))
    this.trackComponentSubscription = undefined
  }

  ngAfterViewInit() {
    console.log('AfterViewInit')

    if (!this.videoTrackComponent) return
  }

  ngAfterViewChecked() {
    /* Est-ce qu'on ne pourrait pas juste ignorer la modif des tracks au final ? */
    console.log('AfterViewChecked')

    if (!this.videoTrackComponent) return

      /* A corriger, ne fonctionne qu'une fois */
    if (!this.trackComponentSubscription) {
      /*
      let playerData$: Observable<PlayerData> = this.videoTrackComponent.getData()

      if (playerData$) {
        this.trackComponentSubscription = playerData$.subscribe(data => {
        console.log('subscribe in PlayerComponent')
        console.warn('this.trackcomponentSubscription')
        if (this.trackComponentSubscription) console.warn('DEfined')
          else console.warn('undefined')
        this.updatePlayerData(data)
        this.trackComponentSubscription.unsubscribe()
        this.trackComponentSubscription = undefined
      })
        console.warn('END OF SUBSCRIBE')
      }
      else 
      {
        console.log('playerDate undefined')

      }
      */

/*
      this.trackComponentSubscription = this.videoTrackComponent.getData()
      .subscribe(data => {
        console.log('subscribe in PlayerComponent')
        this.updatePlayerData(data)

        /* Ca n'a pas trop l'air de marcher (-> update playerData ?) ... */
/*
        this.trackComponentSubscription.unsubscribe()
        this.trackComponentSubscription = undefined
      })
*/
    }
  }

  updatePlayerData(data: PlayerData) {
      this.player = data
      /*
      this.selectedVideoTrack = this.getSelectedVideoTrack()
      this.selectedAudioTrack = this.getSelectedAudioTrack()
      this.selectedSubtitleTrack = this.getSelectedSubtitleTrack()
      */

console.log('UPDATE DATA')
//console.warn(JSON.stringify(this.playerService))
/*
      if (this.timerComponent === undefined) return
      this.timerComponent.updateTimer(this.player.time)
    */

      if (this.timerComponent) this.timerComponent.updateTimer(this.player.time)
      if (this.videoTrackComponent) this.videoTrackComponent.setTracks(this.player.tracks.video)
      if (this.audioTrackComponent) this.audioTrackComponent.setTracks(this.player.tracks.audio)
      if (this.subtitleTrackComponent) this.subtitleTrackComponent.setTracks(this.player.tracks.subtitle)
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

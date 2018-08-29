import { Component, OnInit, Input } from '@angular/core'
import { PlayerData, Track } from '../../../../shared'
import { PlayerService } from '../service'

@Component({
  selector: 'app-track',
  templateUrl: './track.component.html',
  styleUrls: ['./track.component.css']
})
export class TrackComponent implements OnInit {
  @Input() type: string
  @Input() tracks: Track[]
  selectedTrack: Track

  constructor(private playerService: PlayerService) {}

  ngOnInit() {
    this.selectedTrack = this.getSelectedTrack()
  }

  updateValue(track: Track): void {
    this.playerService.setTrack(this.type, track.id).subscribe()
  }

  setTracks(tracks: Track[]) {
    this.tracks = tracks
    this.selectedTrack = this.getSelectedTrack()
  }

  setSelectedTrack(newTrack: Track) {
    this.selectedTrack = newTrack
    this.updateValue(newTrack)
  }

  getSelectedTrack(): Track {
    return this.tracks.find(track => track.selected === true)
  }
}

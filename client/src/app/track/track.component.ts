import { Component, OnInit, Input } from '@angular/core'
import { Observable, of } from 'rxjs'
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
  data: Observable<PlayerData>

  constructor(private playerService: PlayerService) { console.log('constructor')}

  ngOnInit() {
    console.log('Child component type: '+this.type)
    this.selectedTrack = this.getSelectedTrack()
  }

  getData(): Observable<PlayerData> {
    return this.data
  }

  updateValue(track: Track): void {
    this.playerService.setTrack(this.type, track.id).subscribe(data => {
      console.log('Subscribe in track')
      this.data = of(data)
    })
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

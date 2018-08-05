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
  data: Observable<PlayerData>

  constructor(private playerService: PlayerService) { console.log('constructor')}

  ngOnInit() {
    console.log('Child component type: '+this.type)
  }

  getData(): Observable<PlayerData> {
    return this.data
  }

  updateValue(): void {
    this.playerService.setTrack('video', -1).subscribe(data => {
      console.log('Subscribe in track')
      this.data = of(data)
    })
  }
}

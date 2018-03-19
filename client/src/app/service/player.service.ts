import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs/Observable'
import { Player, Track } from '../models'

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}

@Injectable()
export class PlayerService {
  player: Player = undefined

  constructor(
    private http: HttpClient) { }

  init(): Observable<Player> {
  	return this.refresh()
  }

  refresh(): Observable<Player> {
    return this.http.get<Player>('/api/all')
    				//.map((res: Response) => {return res.json()})
                    //.subscribe(data => {this.player = data; console.log(this.player)})
  }

  getPlayerInformations() : Player {
    return this.player
  }

  pause() {
    console.log('Pause')
  }
  play() {
    console.log('Play')
  }
  setTime(seconds: number) {
    console.log(`Time: ${seconds}`)
  }

  volumeDown() {
  	console.log('Volume down')
  }
  volumeUp() {
  	console.log('Volume UP')
  }
  setVolume(volume: number) {
  	console.log(`Volume: ${volume}`)
  }

  setTrack(type: string, track: Track) {
    console.log(`New ${type} track: ${track.id}`)
  }
}

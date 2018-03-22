import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs/Observable'
import { Player, Track } from '../models'

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}

@Injectable()
export class PlayerService {
  apiRoute: string = '/api'
  volumeRoute: string = `${this.apiRoute}/volume`
  player: Player = undefined

  constructor(
    private http: HttpClient) { }

  init(): Observable<Player> {
  	return this.refresh()
  }

  refresh(): Observable<Player> {
    return this.http.get<Player>(`${this.apiRoute}/all`)
    				//.map((res: Response) => {return res.json()})
                    //.subscribe(data => {this.player = data; console.log(this.player)})
  }

  getPlayerInformations() : Player {
    return this.player
  }

  pause(): Observable<Player> {
    return this.http.put<Player>(`${this.apiRoute}/pause`, null)
  }
  play(): Observable<Player> {
    return this.http.put<Player>(`${this.apiRoute}/play`, null)
  }
  setTime(seconds: number) {
    console.log(`Time: ${seconds}`)
  }

  volumeDown(): Observable<Player> {
    return this.http.put<Player>(`${this.volumeRoute}/down`, null)
  }
  volumeUp(): Observable<Player> {
    return this.http.put<Player>(`${this.volumeRoute}/up`, null)
  }
  setVolume(volume: number): Observable<Player> {
    return this.http.put<Player>(`${this.volumeRoute}/${volume}`, null)
  }

  setTrack(type: string, track: Track) {
    console.log(`New ${type} track: ${track.id}`)
  }
}

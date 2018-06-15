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
  timeRoute: string = `${this.apiRoute}/time`
  volumeRoute: string = `${this.apiRoute}/volume`

  constructor(
    private http: HttpClient) { }

  init(): Observable<Player> {
  	return this.refresh()
  }

  refresh(): Observable<Player> {
    return this.http.get<Player>(`${this.apiRoute}/all`)
  }

  pause(): Observable<Player> {
    return this.http.put<Player>(`${this.apiRoute}/pause`, null)
  }
  play(): Observable<Player> {
    return this.http.put<Player>(`${this.apiRoute}/play`, null)
  }
  setTime(seconds: number): Observable<Player> {
    return this.http.put<Player>(`${this.timeRoute}/${seconds}`, null)
  }
  addTime(seconds: number): Observable<Player> {
    return this.http.put<Player>(`${this.timeRoute}/add/${seconds}`, null)
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

  setTrack(type: string, trackId: number): Observable<Player> {
    return this.http.put<Player>(`${this.apiRoute}/${type}/${trackId}`, null)
  }
}

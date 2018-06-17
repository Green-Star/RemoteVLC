import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs/Observable'
import { PlayerData, Track } from '../../../../shared'

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

  init(): Observable<PlayerData> {
  	return this.refresh()
  }

  refresh(): Observable<PlayerData> {
    return this.http.get<PlayerData>(`${this.apiRoute}/all`)
  }

  pause(): Observable<PlayerData> {
    return this.http.put<PlayerData>(`${this.apiRoute}/pause`, null)
  }
  play(): Observable<PlayerData> {
    return this.http.put<PlayerData>(`${this.apiRoute}/play`, null)
  }
  setTime(seconds: number): Observable<PlayerData> {
    return this.http.put<PlayerData>(`${this.timeRoute}/${seconds}`, null)
  }
  addTime(seconds: number): Observable<PlayerData> {
    return this.http.put<PlayerData>(`${this.timeRoute}/add/${seconds}`, null)
  }

  volumeDown(): Observable<PlayerData> {
    return this.http.put<PlayerData>(`${this.volumeRoute}/down`, null)
  }
  volumeUp(): Observable<PlayerData> {
    return this.http.put<PlayerData>(`${this.volumeRoute}/up`, null)
  }
  setVolume(volume: number): Observable<PlayerData> {
    return this.http.put<PlayerData>(`${this.volumeRoute}/${volume}`, null)
  }

  setTrack(type: string, trackId: number): Observable<PlayerData> {
    return this.http.put<PlayerData>(`${this.apiRoute}/${type}/${trackId}`, null)
  }
}

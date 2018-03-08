import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'

import { Player } from '../player'

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}

@Injectable()
export class PlayerService {
  player: Player = undefined

  constructor(
    private http: HttpClient) { }

  init() {
    return this.http.get<Player>('/api/all')
                    .subscribe(data => {this.player = data; console.log(this.player)})
  }

  getPlayerInformations() : Player {
    return this.player
  }
}

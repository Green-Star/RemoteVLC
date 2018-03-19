import { Component, OnInit } from '@angular/core'
import { PlayerService } from './service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  //player = undefined

  constructor(private playerService : PlayerService) {}

  ngOnInit() {
  	//this.player = this.playerService.init()
  	//this.playerService.init().subscribe(data => this.player = data)
  }
}

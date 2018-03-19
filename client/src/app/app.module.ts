import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'
import { PlayerService } from './service'

import { AppComponent } from './app.component';
import { PlayerComponent } from './player/player.component'

import { DisplaySecondsPipe } from './display-seconds.pipe'
import { DisplayTrackPipe } from './display-track.pipe'

@NgModule({
  declarations: [
    AppComponent,
    PlayerComponent,
    DisplaySecondsPipe,
    DisplayTrackPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    PlayerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

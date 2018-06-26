import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'
import { PlayerService } from './service'

import { DisplaySecondsPipe, DisplayTrackPipe } from './pipes'

import { AppComponent } from './app.component'
import { PlayerComponent } from './player/player.component'
import { TimerComponent } from './timer/timer.component';
import { TrackComponent } from './track/track.component'

@NgModule({
  declarations: [
    AppComponent,
    PlayerComponent,
    DisplaySecondsPipe,
    DisplayTrackPipe,
    TimerComponent,
    TrackComponent
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

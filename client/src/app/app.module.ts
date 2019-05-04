import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'
import { MatDialogModule } from '@angular/material'
import { PlayerService } from './service'

import { DisplaySecondsPipe, DisplayTrackPipe } from './pipes'

import { AppComponent } from './app.component'
import { PlayerComponent } from './player/player.component'
import { TimerComponent } from './timer/timer.component';
import { TrackComponent } from './track/track.component';
import { TimeDialogComponent } from './time-dialog/time-dialog.component'

@NgModule({
  declarations: [
    AppComponent,
    PlayerComponent,
    DisplaySecondsPipe,
    DisplayTrackPipe,
    TimerComponent,
    TrackComponent,
    TimeDialogComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    MatDialogModule
  ],
  providers: [
    PlayerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

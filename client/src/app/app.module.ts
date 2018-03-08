import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { HttpClientModule } from '@angular/common/http'
import { PlayerService } from './service'

import { AppComponent } from './app.component'


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [
    PlayerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

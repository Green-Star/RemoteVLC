import { Component, OnInit, Input } from '@angular/core'
import { MatDialog } from '@angular/material'

import { TimeDialogComponent } from '../time-dialog/time-dialog.component'

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent implements OnInit {
  @Input() isPlaying: boolean
  @Input() length: number
  @Input() time: number

  timer: number

  constructor(public dialog: MatDialog) {}

  ngOnInit() {
    if (this.isPlaying === true) {
      this.startTimer()
    }
  }

  private updateSeconds() {
    this.time++
  }

  startTimer() {
    this.timer = window.setInterval(() => this.updateSeconds(), 1000)
  }

  updateTimer(seconds: number) {
    this.time = seconds
  }

  getTimer(): number {
    return this.time
  }

  stopTimer() {
    clearInterval(this.timer)
  }

  openTimeDialog() {
    let timeDialog = this.dialog.open(TimeDialogComponent, { maxWidth: '100vw', position: { left: '0px' }, data: this.length })
    timeDialog.afterClosed().subscribe(result => {
      console.log(`Finished! Result: ${result}`)
    })
  }
}

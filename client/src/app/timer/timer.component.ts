import { Component, OnInit, Input } from '@angular/core'

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

  constructor() {}

  ngOnInit() {
    if (this.isPlaying === true) {
      this.startTimer()
    }
  }

  private updateSeconds() {
    this.time++
  }

  startTimer() {
    this.timer = setInterval(() => this.updateSeconds(), 1000)
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
}

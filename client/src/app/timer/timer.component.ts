import { Component, OnInit, Input } from '@angular/core'

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent implements OnInit {
  @Input() length: number
  time: number

  timer: number

  constructor() {}

  ngOnInit() {
    this.time = 0
    this.timer = undefined
  }

  private updateSeconds() {
    this.time++
    console.log('updateSeconds: '+this.time)
  }
  startTimer() {
    console.log('startTimer')
    this.timer = setInterval(() => this.updateSeconds(), 1000)
  }
  updateTimer(seconds: number) {
    console.log('updateTimer with '+seconds+' seconds')
    this.time = seconds
  }
  getTimer(): number {
    console.log('Timer value: ' + this.time)
    return this.time
  }
  stopTimer() {
    console.log('stopTimer')
    clearInterval(this.timer)
  }
}

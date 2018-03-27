
export class Timer {
  timer

  startTimer(callback) {
    this.timer = setInterval(callback, 1000)
    console.log(this.timer)
    return this.timer
  }

  pauseTimer() {
    clearInterval(this.timer)
  }
}
import { Component, OnInit, Inject } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'

@Component({
  selector: 'app-time-dialog',
  templateUrl: './time-dialog.component.html',
  styleUrls: ['./time-dialog.component.css']
})
export class TimeDialogComponent implements OnInit {
  private length: number

  maxHours: number
  maxMinutes: number
  maxSeconds: number

  selectedHours: number
  selectedMinutes: number
  selectedSeconds: number

  constructor(
    public dialogRef: MatDialogRef<TimeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: number
  ) {
    this.length = data
  }

  ngOnInit() {
    let remainder = this.length

    let hours = Math.trunc(remainder / 3600)
    remainder %= 3600
    let minutes = Math.trunc(remainder / 60)
    remainder %= 60
    let seconds = remainder

    this.maxHours = hours
    this.maxMinutes = (this.maxHours === 0) ? minutes : 59
    this.maxSeconds = (this.maxMinutes === 0) ? seconds : 59

    this.selectedHours = 0
    this.selectedMinutes = 0
    this.selectedSeconds = 0
  }

  getSelectedTime(): number {
    return this.selectedHours * 3600 + this.selectedMinutes * 60 + this.selectedSeconds
  }

  validateTime(): boolean {
    return this.getSelectedTime() <= this.length
  }

  isValidTime(): boolean {
    return this.validateTime() === true
  }

  isInvalidTime(): boolean {
    return this.validateTime() === false
  }

  displayHours(): boolean {
    return this.maxHours > 0
  }

  displayMinutes(): boolean {
    return this.maxMinutes > 0
  }

  displaySeconds(): boolean {
    return this.maxSeconds > 0
  }

  close(): void {
    let result

    result = this.isValidTime() ? this.getSelectedTime() : undefined

    this.dialogRef.close(result)
  }

  cancel(): void {
    this.dialogRef.close(undefined)
  }
}

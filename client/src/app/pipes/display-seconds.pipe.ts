import { Pipe, PipeTransform } from '@angular/core'

@Pipe({name: 'displaySeconds'})
export class DisplaySecondsPipe implements PipeTransform {
  transform(seconds: number): string {
  	/* 
      Use ~~(a/b) syntax to get the integer division of a/b 
      (in JS, even integer divison returns floating point value) 
      see: https://stackoverflow.com/a/17218003/7683968
  	*/
  	let hours = ~~(seconds / 3600)
  	seconds %= 3600
  	let minutes = ~~(seconds / 60)
  	seconds %= 60

    return '' 
    		+ ((hours > 0) ? (hours + ':') : '') 
    		+ ((minutes > 9) ? minutes : '0' + minutes) 
    		+ ':' 
    		+ ((seconds > 9) ? seconds : '0' + seconds)
  }
}

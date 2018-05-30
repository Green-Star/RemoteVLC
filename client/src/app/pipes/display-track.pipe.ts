import { Pipe, PipeTransform } from '@angular/core'
import { Track } from '../models'

@Pipe({name: 'displayTrack'})
export class DisplayTrackPipe implements PipeTransform {
  transform(track: Track): string {  	
    return (track.title !== undefined) ? `${track.title} - ${track.language}` : `${track.language}`
  }
}

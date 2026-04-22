import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'duration', standalone: true })
export class DurationPipe implements PipeTransform {
  transform(minutes: number): string {
    // TODO: if minutes < 60, return `${minutes}m`
    // TODO: otherwise calculate hours and remaining minutes
    //       return `${h}h ${m}m` or `${h}h` if no remaining minutes
    return '';
  }
}

import { Pipe, PipeTransform } from '@angular/core';

// TODO: import TrafficStatus enum from the traffic-flow models

@Pipe({ name: 'trafficStatus', standalone: true })
export class TrafficStatusPipe implements PipeTransform {
  transform(value: any): string {
    // TODO: Map each TrafficStatus enum value to a human-readable label
    //   Free      → 'Free Flow'
    //   Moderate  → 'Moderate'
    //   Congested → 'Congested'
    //   Blocked   → 'Blocked'
    return '';
  }
}

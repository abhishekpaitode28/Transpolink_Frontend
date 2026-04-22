import { Pipe, PipeTransform } from '@angular/core';
import { TrafficStatus } from '../../modules/traffic-flow/models/traffic-status.enum';

@Pipe({ name: 'trafficStatus', standalone: true })
export class TrafficStatusPipe implements PipeTransform {
  transform(value: TrafficStatus): string {
    const map: Record<TrafficStatus, string> = {
      [TrafficStatus.Free]:      'Free Flow',
      [TrafficStatus.Moderate]:  'Moderate',
      [TrafficStatus.Congested]: 'Congested',
      [TrafficStatus.Blocked]:   'Blocked',
    };
    return map[value] ?? 'Unknown';
  }
}

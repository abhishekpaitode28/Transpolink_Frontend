import { Component, Input, OnChanges } from '@angular/core';
import { TrafficFlow } from '../../models/traffic-flow.model';

@Component({
  selector: 'tl-traffic-flow-chart',
  standalone: true,
  template: `
    <div class="tl-chart-placeholder">
      <p style="text-align:center;color:#888;padding:40px">
        Chart: {{ flows.length }} readings — integrate Chart.js or ngx-charts here
      </p>
      <ul style="font-size:12px;color:#666">
        @for (f of flows.slice(0,5); track f.id) {
          <li>{{ f.recordedAt }} — {{ f.vehicleCount }} vehicles, {{ f.averageSpeedKph }} kph, congestion {{ f.congestionLevel }}%</li>
        }
      </ul>
    </div>
  `,
})
export class TrafficFlowChartComponent implements OnChanges {
  @Input() flows: TrafficFlow[] = [];

  ngOnChanges() {
    // Wire up Chart.js / D3 here
  }
}

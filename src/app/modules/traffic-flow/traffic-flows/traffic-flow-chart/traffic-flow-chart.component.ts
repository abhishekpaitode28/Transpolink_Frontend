import { Component, Input, OnChanges } from '@angular/core';

// TODO: import TrafficFlow from models

@Component({
  selector: 'tl-traffic-flow-chart',
  standalone: true,
  template: `
    <!-- TODO: Render a chart showing vehicle count, speed, and congestion over time
         Options: integrate Chart.js via ng2-charts, or ngx-charts, or plain canvas API
         For now show a placeholder message with the number of readings available -->
  `,
})
export class TrafficFlowChartComponent implements OnChanges {

  // TODO: @Input() flows: TrafficFlow[] = []

  ngOnChanges(): void {
    // TODO: when flows input changes, rebuild the chart dataset and re-render
    // Chart X axis: recordedAt timestamps
    // Chart Y axes: vehicleCount, averageSpeedKph, congestionLevel
  }
}

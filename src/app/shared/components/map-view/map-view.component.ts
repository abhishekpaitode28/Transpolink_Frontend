import { Component, Input, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'tl-map-view',
  standalone: true,
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss'],
})
export class MapViewComponent implements OnInit, OnDestroy {
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;
  @Input() center: [number, number] = [13.0827, 80.2707]; // Chennai default
  @Input() zoom = 12;

  private map: unknown = null;

  ngOnInit() {
    // Leaflet initialised here — import dynamically to avoid SSR issues
    // import('leaflet').then(L => { this.map = L.map(this.mapContainer.nativeElement)... });
  }

  ngOnDestroy() {
    // (this.map as any)?.remove();
  }
}

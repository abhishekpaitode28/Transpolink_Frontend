import { Component, Input, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'tl-map-view',
  standalone: true,
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss'],
})
export class MapViewComponent implements OnInit, OnDestroy {

  // TODO: @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef
  // TODO: @Input() center: [number, number] = [13.0827, 80.2707]  ← Chennai default
  // TODO: @Input() zoom = 12

  // TODO: declare a private map variable to hold the Leaflet map instance

  ngOnInit(): void {
    // TODO: Dynamically import Leaflet to avoid SSR issues:
    //   import('leaflet').then(L => {
    //     this.map = L.map(this.mapContainer.nativeElement).setView(this.center, this.zoom)
    //     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map)
    //   })
  }

  ngOnDestroy(): void {
    // TODO: call (this.map as any)?.remove() to clean up the Leaflet instance
  }
}

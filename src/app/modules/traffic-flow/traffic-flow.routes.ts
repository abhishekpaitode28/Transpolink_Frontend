import { Routes } from '@angular/router';

export const TRAFFIC_FLOW_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'road-segments',
    pathMatch: 'full',
  },
  {
    path: 'road-segments',
    loadComponent: () =>
      import('./road-segments/road-segment-list/road-segment-list.component').then(
        (m) => m.RoadSegmentListComponent
      ),
  },
  {
    path: 'road-segments/new',
    loadComponent: () =>
      import('./road-segments/road-segment-form/road-segment-form.component').then(
        (m) => m.RoadSegmentFormComponent
      ),
  },
  {
    path: 'road-segments/:id',
    loadComponent: () =>
      import('./road-segments/road-segment-detail/road-segment-detail.component').then(
        (m) => m.RoadSegmentDetailComponent
      ),
  },
  {
    path: 'road-segments/:id/edit',
    loadComponent: () =>
      import('./road-segments/road-segment-form/road-segment-form.component').then(
        (m) => m.RoadSegmentFormComponent
      ),
  },
  {
    path: 'flows',
    loadComponent: () =>
      import('./traffic-flows/traffic-flow-list/traffic-flow-list.component').then(
        (m) => m.TrafficFlowListComponent
      ),
  },
];

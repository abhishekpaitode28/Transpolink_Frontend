import { Routes } from "@angular/router";
import { roleGuard } from "../../core/guards/roles.guard";

export const TRAFFIC_FLOW_ROUTES : Routes = [
  {
    path: '',
    loadComponent: () => 
      import('./road-segments/road-segment-list/road-segment-list.component').then(m => m.RoadSegmentListComponent)
  },
  {
    path: 'segment/new',
    canActivate: [roleGuard],
    data: {roles : ['Admin', 'Traffic Officer']},
    loadComponent: () =>
      import('./road-segments/road-segment-form/road-segment-form.component').then(m => m.RoadSegmentFormComponent)
  },
  {
    path:'segment/:id',
    loadComponent: () => 
      import('./road-segments/road-segment-detail/road-segment-detail.component').then(m => m.RoadSegmentDetailComponent)
  },
  {
    path: 'segment/:id/edit',
    canActivate: [roleGuard],
    data: {roles : ['Admin', 'Traffic Officer']},
    loadComponent: () => 
      import('./road-segments/road-segment-form/road-segment-form.component')
      .then(m => m.RoadSegmentFormComponent)
  },
  {
    path: 'history',
    loadComponent: () => 
      import('./traffic-flows/traffic-flow-list/traffic-flow-list.component')
      .then(m => m.TrafficFlowListComponent)
  },
  {
    path: 'record',
    canActivate: [roleGuard],
    data: {roles : ['Admin', 'Traffic Officer']},
    loadComponent: () => 
      import('./traffic-flows/traffic-flow-form/traffic-flow-form.component')
      .then(m => m.TrafficFlowFormComponent)
  }



]
import { Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';

@Injectable({ providedIn: 'root' })
export class ComplianceService {
  constructor(private api: ApiService) {}
}

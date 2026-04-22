import { Component, Input, Output, EventEmitter } from '@angular/core';

// TODO: import CommonModule (for NgFor, NgIf etc.) or use @for/@if control flow

// TODO: Define the TableColumn interface
// Fields: key (string), label (string), sortable? (boolean)
export interface TableColumn {}

@Component({
  selector: 'tl-data-table',
  standalone: true,
  imports: [], // TODO: add CommonModule if needed
  templateUrl: './data-table.component.html',
})
export class DataTableComponent {
  // TODO: @Input() columns: TableColumn[] = []
  // TODO: @Input() rows: Record<string, unknown>[] = []
  // TODO: @Input() loading = false
  // TODO: @Output() rowClick = new EventEmitter<Record<string, unknown>>()
  // TODO: @Output() sortChange = new EventEmitter<{ key: string; direction: 'asc' | 'desc' }>()
}

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-filter-section',
  imports: [CommonModule, TranslatePipe],
  templateUrl: './filter-section.html',
  styleUrls: ['./filter-section.css'],
})
export class FilterSection {
  @Input() title?: string;
  @Input() showReset = false;
  @Output() resetData = new EventEmitter<void>();
}

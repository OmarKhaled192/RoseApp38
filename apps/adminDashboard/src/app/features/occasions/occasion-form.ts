import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { DynamicForm, FieldConfig } from '@org/ui';

@Component({
  selector: 'app-occasion-form',
  standalone: true,
  imports: [CommonModule, DynamicForm, TranslatePipe],
  templateUrl: './occasion-form.html',
  styleUrl: './occasion-form.css',
})
export class OccasionForm {
  mode = input<'add' | 'edit'>('add');
  occasionId = input<string | null>(null);

  readonly formTitle = computed(() =>
    this.mode() === 'edit' ? 'dashboard.occasions.editTitle' : 'dashboard.occasions.addTitle',
  );

  readonly submitLabel = computed(() =>
    this.mode() === 'edit' ? 'dashboard.occasions.updateButton' : 'dashboard.occasions.addButton',
  );

  readonly formFields = computed<FieldConfig[]>(() => [
    {
      key: 'name',
      label: 'Name',
      type: 'text',
      required: true,
      placeholder: 'Enter occasion name',
      row: 1,
    },
    {
      key: 'image',
      label: 'Occasion image',
      type: 'upload',
      required: true,
      accept: 'image/*',
      row: 2,
    },
  ]);

  onSubmit(data: Record<string, any>): void {
    console.log('Occasion submitted', this.mode(), this.occasionId(), data);
  }
}

import { Component, input } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';
import { FieldConfig } from 'libs/shared/ui/src/models/field-types';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'lib-textarea-field',
  imports: [FormField, TextareaModule],
  templateUrl: './textarea-field.html'
})
export class TextareaField {
  field = input.required<Extract<FieldConfig, { type: 'textarea' }>>();
  control = input.required<FieldTree<string>>();
}

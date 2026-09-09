import { Component, input } from '@angular/core';
import { FormField ,FieldTree } from '@angular/forms/signals';
import { SelectModule } from 'primeng/select';
import { FieldConfig } from 'libs/shared/ui/src/models/field-types';
@Component({
  selector: 'lib-select-field',
  imports: [FormField, SelectModule],
  templateUrl: './select-field.html'
})
export class SelectField {
  field = input.required<Extract<FieldConfig, { type: 'select' }>>();
  control = input.required<FieldTree<string>>();
}

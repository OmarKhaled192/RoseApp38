import { Component, input } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';
import { FieldConfig } from 'libs/shared/ui/src/models/field-types';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'lib-checkbox-field',
  imports: [FormField, CheckboxModule],
  templateUrl: './checkbox-field.html'
})
export class CheckboxField {
   field = input.required<Extract<FieldConfig, { type: 'checkbox' }>>();
  control = input.required<FieldTree<boolean>>();
}

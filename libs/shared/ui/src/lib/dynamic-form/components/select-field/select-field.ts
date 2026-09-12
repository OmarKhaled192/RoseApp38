import { Component, input } from '@angular/core';
import { FormField ,FieldTree } from '@angular/forms/signals';
import { SelectModule } from 'primeng/select';
import { FieldConfig } from 'libs/shared/ui/src/models/field-types';
@Component({
  selector: 'lib-select-field',
  imports: [FormField, SelectModule],
  template: `
  <div class="flex flex-col gap-1 w-full">
  <label class="text-sm font-medium text-gray-700" [for]="field().key">{{ field().label }}{{ field().required ? ' *' : '' }}</label>

  <p-select [inputId]="field().key" [formField]="$any(control())" [options]="field().options" optionLabel="label"
    optionValue="value" placeholder="اختر..." />
</div>`
})
export class SelectField {
  field = input.required<Extract<FieldConfig, { type: 'select' }>>();
  control = input.required<FieldTree<string>>();
}

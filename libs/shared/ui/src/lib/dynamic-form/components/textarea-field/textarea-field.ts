import { Component, input } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';
import { FieldConfig } from 'libs/shared/ui/src/models/field-types';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'lib-textarea-field',
  imports: [FormField, TextareaModule],
  template: `
  <div class="flex flex-col gap-1 w-full" [class.untouched]="!control()().touched()">
  <label class="text-sm font-medium text-gray-700" [for]="field().key">{{ field().label }}{{ field().required ? ' *' :
    '' }}</label>
  <textarea pTextarea [rows]="field().rows ?? 4" [placeholder]="field().placeholder ?? ''" [formField]="control()"
    [autoResize]="true"></textarea>
  @if (control()().touched() && control()().invalid()) {
    <span class="text-red-600 text-xs">
      {{ control()().errors()[0]?.message }}
    </span>
  }
</div>
  `
})
export class TextareaField {
  field = input.required<Extract<FieldConfig, { type: 'textarea' }>>();
  control = input.required<FieldTree<string>>();
}


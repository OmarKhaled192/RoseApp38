import { NgComponentOutlet } from '@angular/common';
import { Component, computed, effect, input, output, signal } from '@angular/core';
import { form, required } from '@angular/forms/signals';
import { FIELD_COMPONENTS } from '../../constant/field-registry';
import { FieldConfig } from '../../models/field-types';
@Component({
  selector: 'lib-dynamic-form',
  imports: [NgComponentOutlet],
  templateUrl: './dynamic-form.html'
})
export class DynamicForm {
  fields = input<FieldConfig[]>([]);

  formSubmit = output<Record<string, any> | FormData>();

  FIELD_COMPONENTS = FIELD_COMPONENTS;

  model = computed(() =>
    Object.fromEntries(
      this.fields().map(f => [f.key, f.type === 'checkbox' ? false : ''])
    )
  );

  private modelSignal = signal<Record<string, any>>({});

  constructor() {
    effect(() => {
      this.modelSignal.set(
        Object.fromEntries(
          this.fields().map(f => [f.key, f.type === 'checkbox' ? false : ''])
        )
      );
    });
  }

  userForm = form(this.modelSignal, (path) => {
    this.fields().forEach(field => {
      if (field.required) {
        required(path[field.key], { message: `${field.label} مطلوب` });
      }
    });
  });

  uploadedFiles = computed(() => {
    const files: Record<string, File | File[]> = {};
    this.fields()
      .filter(f => f.type === 'upload')
      .forEach(f => (files[f.key] = this.modelSignal()[f.key]));
    return files;
  });

  getInputs(field: FieldConfig) {
    return { field, control: this.userForm[field.key] };
  }

  onSubmit(e: Event) {
    e.preventDefault();
    if (this.userForm().invalid()) return;

    const hasFiles = Object.keys(this.uploadedFiles()).length > 0;

    if (hasFiles) {
      const formData = new FormData();
      const plainData = { ...this.modelSignal() };

      this.fields()
        .filter(f => f.type === 'upload')
        .forEach(f => {
          const value = plainData[f.key];
          delete plainData[f.key];
          if (Array.isArray(value)) value.forEach(file => formData.append(f.key, file));
          else if (value) formData.append(f.key, value);
        });

      formData.append('data', JSON.stringify(plainData));
      this.formSubmit.emit(formData);
    } else {
      this.formSubmit.emit(this.modelSignal());
    }
  }
}

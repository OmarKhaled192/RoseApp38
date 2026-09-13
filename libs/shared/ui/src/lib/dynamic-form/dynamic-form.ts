import { NgComponentOutlet } from '@angular/common';
import { Component, computed, effect, input, output, signal } from '@angular/core';
import { form, required } from '@angular/forms/signals';
import { FIELD_COMPONENTS } from '../../constant/field-registry';
import { FieldConfig, FileUploadFn } from '../../models/field-types';
import { forkJoin, map, of } from 'rxjs';

@Component({
  selector: 'lib-dynamic-form',
  imports: [NgComponentOutlet],
  templateUrl: './dynamic-form.html',
  styleUrl: './dynamic-form.css',
})
export class DynamicForm {
  fields = input<FieldConfig[]>([]);
  mode = input<'create' | 'update'>('create');
  formSubmit = output<Record<string, any> | FormData>();
  valueChanges = output<Record<string, any>>();
  initialData = input<Record<string, any> | null>(null);
  uploadFn = input<FileUploadFn>();
  submitLabel = input<string>('Add');
  isSubmitting = signal(false);

  FIELD_COMPONENTS = FIELD_COMPONENTS;

  groupedFields = computed(() => {
    const groups = new Map<number, FieldConfig[]>();
    this.fields().forEach((field, index) => {
      const row = field.row ?? index;
      if (!groups.has(row)) groups.set(row, []);
      groups.get(row)!.push(field);
    });
    return Array.from(groups.values());
  });

  private modelSignal = signal<Record<string, any>>({});

  constructor() {
    effect(() => {
      const defaults = Object.fromEntries(
        this.fields().map(f => [f.key, f.type === 'checkbox' ? false : ''])
      );
      const data = this.initialData();
      this.modelSignal.set(data ? { ...defaults, ...data } : defaults);
    });

    effect(() => {
      this.valueChanges.emit(this.modelSignal());
    });
  }

  userForm = form(this.modelSignal, (path) => {
    this.fields().forEach(field => {
      if (field.required) required(path[field.key], { message: `${field.label} مطلوب` });
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

    const excludedKeys = this.fields()
      .filter(f => f.excludeFromSubmit)
      .map(f => f.key);

    const model = { ...this.modelSignal() };
    excludedKeys.forEach(key => delete model[key]);

    const uploadFields = this.fields().filter(f => f.type === 'upload');
    const upload = this.uploadFn();

    if (!uploadFields.length || !upload) {
      this.formSubmit.emit(model);
      return;
    }

    this.isSubmitting.set(true);

    const uploads$ = uploadFields.map(field => {
      const value = model[field.key];
      const files: File[] = Array.isArray(value) ? value : (value ? [value] : []);

      if (!files.length) {
        return of([field.key, field.multiple ? [] : null] as const);
      }

      return forkJoin(files.map(f => upload(f))).pipe(
        map(urls => [field.key, field.multiple ? urls : urls[0]] as const)
      );
    });

    forkJoin(uploads$).subscribe({
      next: (results) => {
        results.forEach(([key, url]) => (model[key] = url));
        this.formSubmit.emit(model);
        this.isSubmitting.set(false);
      },
      error: () => this.isSubmitting.set(false),
    });
  }
}
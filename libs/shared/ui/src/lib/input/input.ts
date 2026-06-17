import { CommonModule } from '@angular/common';
import { Component, forwardRef, input, signal } from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';

import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { TextareaModule } from 'primeng/textarea';
import { DatePickerModule } from 'primeng/datepicker';

import { ErrorMessage } from '../error-message/error-message';

export type InputType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'tel'
  | 'url'
  | 'search'
  | 'date'
  | 'textarea'
  | 'calendar';

@Component({
  selector: 'lib-input',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    InputTextModule,
    PasswordModule,
    TextareaModule,
    DatePickerModule,
    ErrorMessage,
  ],
  templateUrl: './input.html',
  styleUrl: './input.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent implements ControlValueAccessor {
  label = input<string>('');
  type = input<InputType>('text');
  placeholder = input<string>('');
  helperText = input<string>('');
  errorMessage = input<string>('');
  isDisabled = input<boolean>(false);
  isReadonly = input<boolean>(false);

  value = signal<any>('');
  touched = signal<boolean>(false);

  disabled = false;

  controlId = `input-${Math.random().toString(36).slice(2, 11)}`;

  onChange: (value: any) => void = () => { ; };
  onTouched: () => void = () => { ; };

  get isControlDisabled(): boolean {
    return this.disabled || this.isDisabled();
  }

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.value.set(value);
    this.onChange(value);
  }

  onTextareaInput(event: Event): void {
    const value = (event.target as HTMLTextAreaElement).value;
    this.value.set(value);
    this.onChange(value);
  }

  onValueChange(value: any): void {
    this.value.set(value);
    this.onChange(value);
  }

  onBlur(): void {
    this.touched.set(true);
    this.onTouched();
  }

  writeValue(value: any): void {
    this.value.set(value ?? '');
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}

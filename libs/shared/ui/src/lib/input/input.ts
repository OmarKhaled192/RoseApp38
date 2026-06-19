import { CommonModule } from '@angular/common';
import { Component, forwardRef, input, signal } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
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

export type InputValue = string | number | Date | null;

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
  control = input<FormControl>(new FormControl());
  type = input<InputType>('text');
  placeholder = input<string>('');
  helperText = input<string>('');
  errorMessage = input<string>('');
  isDisabled = input<boolean>(false);
  isReadonly = input<boolean>(false);

  value = signal<InputValue>(null);
  touched = signal(false);

  disabled = false;

  readonly controlId = `input-${crypto.randomUUID()}`;

  private onChange: (value: InputValue) => void = () => { ; };
  private onTouched: () => void = () => { ; };

  get isControlDisabled(): boolean {
    return this.disabled || this.isDisabled();
  }

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.updateValue(value);
  }

  onTextareaInput(event: Event): void {
    const value = (event.target as HTMLTextAreaElement).value;
    this.updateValue(value);
  }

  onValueChange(value: Date | null): void {
    this.updateValue(value);
  }

  onBlur(): void {
    this.touched.set(true);
    this.onTouched();
  }

  writeValue(value: InputValue): void {
    this.value.set(value);
  }

  registerOnChange(fn: (value: InputValue) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  private updateValue(value: InputValue): void {
    this.value.set(value);
    this.onChange(value);
  }
}

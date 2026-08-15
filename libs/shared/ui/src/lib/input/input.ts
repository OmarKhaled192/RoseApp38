import { CommonModule } from '@angular/common';
import { Component, computed, forwardRef, inject, Injector, input, OnInit, output, signal } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormsModule,
  NG_VALUE_ACCESSOR,
  NgControl,
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
    FormsModule,
    InputTextModule,
    ReactiveFormsModule,
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
export class InputComponent implements ControlValueAccessor, OnInit {
  private readonly injector = inject(Injector);

  label = input<string>('');
  control = input<FormControl>(new FormControl());
  type = input<InputType>('text');
  placeholder = input<string>('');
  helperText = input<string>('');
  isDisabled = input<boolean>(false);
  isReadonly = input<boolean>(false);
  valueChange = output<InputValue>();

  readonly value = signal<InputValue>(null);
  readonly currentValue = input<InputValue>(null);
  readonly disabled = signal(false);
  private readonly parentControl = signal<FormControl | null>(null);

  readonly formControl = computed(() => this.parentControl() ?? this.control() ?? new FormControl());


  readonly controlId = `input-${crypto.randomUUID()}`;

  private onChange: (value: InputValue) => void = () => { ; };

  private onTouched: () => void = () => { ; };

  ngOnInit(): void {
    if (this.control()) {
      return;
    }

    const ngControl = this.injector.get(NgControl, null, { self: true, optional: true });
    this.parentControl.set((ngControl?.control as FormControl | null) ?? null);
  }
  get isControlDisabled(): boolean {
    return this.disabled() || this.isDisabled();
  }

  onInput(event: Event): void {
    const nextValue = (event.target as HTMLInputElement).value;
    this.updateValue(nextValue);
  }

  onTextareaInput(event: Event): void {
    const nextValue = (event.target as HTMLTextAreaElement).value;
    this.updateValue(nextValue);
  }

  onBlur(): void {
    this.onTouched();
    this.formControl()?.markAsTouched({ onlySelf: true });
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
    this.disabled.set(isDisabled);
  }

  updateValue(value: InputValue): void {
    this.value.set(value);
    this.valueChange.emit(value);
    this.onChange(value);
  }
}

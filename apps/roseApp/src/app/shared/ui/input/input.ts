
import { Component, forwardRef, input } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CommonModule } from '@angular/common';

export type InputType = 'text' | 'email' | 'password' | 'number';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, InputTextModule, PasswordModule],
  templateUrl: './input.html',
  styleUrl: './input.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent ),
      multi: true,
    },
  ],
})
export class InputComponent  implements ControlValueAccessor {
  label = input<string>('');
  type = input<'text' | 'email' | 'password' | 'number'>('text');
  placeholder = input<string>('');
  helperText = input<string>('');
  errorMessage = input<string>('');
  isDisabled = input<boolean>(false);
  isReadonly = input<boolean>(false);

  value = '';
  touched = false;
  disabled = false;

  onChange = (_: string) => {};
  onTouched = () => {};

  onInput(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.value = val;
    this.onChange(val);
  }

  onBlur() {
    this.touched = true;
    this.onTouched();
  }

  writeValue(val: string): void {
    this.value = val ?? '';
  }

  registerOnChange(fn: (_: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}

import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CheckboxChangeEvent, CheckboxModule } from 'primeng/checkbox';

export type CheckboxSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'lib-checkbox',
  imports: [CheckboxModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './checkbox.html',
  styleUrl: './checkbox.scss'
})
export class Checkbox {
  checked = model<boolean>(false);

  label = input<string>('');
  description = input<string>('');
  inputId = input<string>(`cb-${Math.random().toString(36).slice(2, 7)}`);
  disabled = input<boolean>(false);
  size = input<CheckboxSize>('md');

  changed = output<boolean>();


  handleChange(event: CheckboxChangeEvent): void {
    this.changed.emit(event.checked ?? false);
  }
}

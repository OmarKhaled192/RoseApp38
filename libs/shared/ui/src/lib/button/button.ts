import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { BadgeModule } from 'primeng/badge';

export type ButtonVariant  = 'primary' | 'secondary' | 'danger' | 'ghost' | 'outlined' | 'text';
export type ButtonSeverity = 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | null;
export type ButtonSize     = 'small' | 'large' | null;
export type ButtonType     = 'button' | 'submit' | 'reset';

@Component({
  selector: 'lib-button',
  imports: [ButtonModule, TooltipModule, BadgeModule],
  templateUrl: './button.html',
   changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Button {
  label = input<string>('');
  icon = input<string>('');
  iconPos = input<'left' | 'right' | 'top' | 'bottom'>('left');
  type = input<ButtonType>('button');
  disabled = input<boolean>(false);
  loading = input<boolean>(false);
  color = input<string>('#A6252A');
  severity = input<ButtonSeverity>(null);
  outlined = input<boolean>(false);
  text = input<boolean>(false);
  raised = input<boolean>(false);
  rounded = input<boolean>(false);
  size = input<ButtonSize>(null);
  styleClass = input<string>('');

  badge = input<string>('');
  badgeSeverity = input<ButtonSeverity>(null);

  tooltip = input<string>('');
  tooltipPosition = input<'top' | 'bottom' | 'left' | 'right'>('top');

  clicked = output<MouseEvent>();

  handleClick(event: MouseEvent): void {
    this.clicked.emit(event);
  }
}

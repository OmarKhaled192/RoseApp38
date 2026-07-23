import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-checkout-delete-modal',
  templateUrl: './checkout-delete-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, TranslatePipe]
})
export class CheckoutDeleteModalComponent {
  open = input<boolean>(false);

  title = input<string>('common.deleteModal.title');
  confirmLabel = input<string>('common.deleteModal.confirm');
  cancelLabel = input<string>('common.deleteModal.cancel');

  confirmed = output<void>();
  cancelled = output<void>();

  onConfirm(): void {
    this.confirmed.emit();
  }

  onCancel(): void {
    this.cancelled.emit();
  }
}

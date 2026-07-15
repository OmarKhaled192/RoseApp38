import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

/**
 * Generic, reusable confirmation modal.
 * Kept intentionally dumb / presentational so it can be reused
 * anywhere a "confirm this destructive action" prompt is needed,
 * not just for deleting addresses.
 */
@Component({
  selector: 'app-checkout-delete-modal',
  templateUrl: './checkout-delete-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutDeleteModalComponent {
  open = input<boolean>(false);
  title = input<string>('Are you sure you want to delete this address?');
  confirmLabel = input<string>('Confirm');
  cancelLabel = input<string>('Cancel');

  confirmed = output<void>();
  cancelled = output<void>();

  onConfirm(): void {
    this.confirmed.emit();
  }

  onCancel(): void {
    this.cancelled.emit();
  }
}

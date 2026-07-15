import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CheckoutAddress } from '../../models/checkout-address.model';

@Component({
  selector: 'app-checkout-address-item',
  templateUrl: './checkout-address-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutAddressItemComponent {
  address = input.required<CheckoutAddress>();

  /** Highlights the card border, e.g. while it's the one targeted by a modal */
  highlighted = input<boolean>(false);

  editRequested = output<CheckoutAddress>();
  deleteRequested = output<CheckoutAddress>();

  onEdit(): void {
    this.editRequested.emit(this.address());
  }

  onDelete(): void {
    this.deleteRequested.emit(this.address());
  }
}

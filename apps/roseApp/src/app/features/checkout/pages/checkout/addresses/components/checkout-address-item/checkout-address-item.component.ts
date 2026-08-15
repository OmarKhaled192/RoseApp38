import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CheckoutAddress } from '../../models/checkout-address.model';

@Component({
  selector: 'app-checkout-address-item',
  templateUrl: './checkout-address-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutAddressItemComponent {
  address = input.required<CheckoutAddress>();
  highlighted = input<boolean>(false);
  groupLabel = input.required<string>();
  editRequested = output<CheckoutAddress>();
  deleteRequested = output<CheckoutAddress>();

  onEdit(event: Event): void {
    event.stopPropagation();
    this.editRequested.emit(this.address());
  }

  onDelete(event: Event): void {
    event.stopPropagation();
    this.deleteRequested.emit(this.address());
  }
}

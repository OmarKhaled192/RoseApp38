import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { CheckoutAddressItemComponent } from '../checkout-address-item/checkout-address-item.component';
import { CheckoutAddAddressComponent } from '../checkout-add-address/checkout-add-address.component';
import { CheckoutDeleteModalComponent } from '../checkout-delete-modal/checkout-delete-modal.component';
import { CheckoutAddress } from '../../models/checkout-address.model';

type CheckoutAddressView = 'list' | 'add' | 'edit';
type CheckoutAddressWizardValue = {
  id?: string;
  title: string;
  isPrimary?: boolean;
  city: string;
  street: string;
  phone: string;
  latitude: number;
  longitude: number;
};

@Component({
  selector: 'app-checkout-address',
  imports: [CheckoutAddressItemComponent, CheckoutAddAddressComponent, CheckoutDeleteModalComponent],
  templateUrl: './checkout-address.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutAddressComponent {
  // --- state -----------------------------------------------------------
  view = signal<CheckoutAddressView>('list');

  addresses = signal<CheckoutAddress[]>([]);

  editingAddress = signal<CheckoutAddress | null>(null);
  deletingAddress = signal<CheckoutAddress | null>(null);

  // --- derived -----------------------------------------------------------
  /** Groups addresses by their title (Home / Work / Family / ...) preserving insertion order */
  groupedAddresses = computed(() => {
    const groups = new Map<string, CheckoutAddress[]>();
    for (const address of this.addresses()) {
      const bucket = groups.get(address.title) ?? [];
      bucket.push(address);
      groups.set(address.title, bucket);
    }
    return Array.from(groups.entries()).map(([title, items]) => ({ title, items }));
  });

  isDeleteModalOpen = computed(() => this.deletingAddress() !== null);

  // --- list actions -----------------------------------------------------------
  openAddAddress(): void {
    this.editingAddress.set(null);
    this.view.set('add');
  }

  openEditAddress(address: CheckoutAddress): void {
    this.editingAddress.set(address);
    this.view.set('edit');
  }

  requestDelete(address: CheckoutAddress): void {
    this.deletingAddress.set(address);
  }

  confirmDelete(): void {
    const target = this.deletingAddress();
    if (!target) {
      return;
    }
    this.addresses.update((current) => current.filter((address) => address.id !== target.id));
    this.deletingAddress.set(null);
  }

  cancelDelete(): void {
    this.deletingAddress.set(null);
  }

  // --- wizard actions -----------------------------------------------------------
  onWizardCancelled(): void {
    this.editingAddress.set(null);
    this.view.set('list');
  }

  onWizardSaved(value: CheckoutAddressWizardValue): void {
    const nextAddress: CheckoutAddress = {
      id: value.id ?? crypto.randomUUID(),
      title: value.title,
      isPrimary: value.isPrimary ?? false,
      city: value.city,
      street: value.street,
      phone: value.phone,
      latitude: value.latitude,
      longitude: value.longitude,
    };

    if (value.id) {
      this.addresses.update((current) =>
        current.map((address) => (address.id === value.id ? nextAddress : address)),
      );
    } else {
      this.addresses.update((current) => [...current, nextAddress]);
    }
    this.editingAddress.set(null);
    this.view.set('list');
  }
}

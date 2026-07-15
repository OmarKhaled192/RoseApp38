import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { CheckoutAddressItemComponent } from '../checkout-address-item/checkout-address-item.component';
import { CheckoutAddAddressComponent } from '../checkout-add-address/checkout-add-address.component';
import { CheckoutDeleteModalComponent } from '../checkout-delete-modal/checkout-delete-modal.component';
import { CheckoutAddress, CheckoutAddressFormValue } from '../../models/checkout-address.model';

type CheckoutAddressView = 'list' | 'add' | 'edit';

@Component({
  selector: 'app-checkout-address',
  imports: [CheckoutAddressItemComponent, CheckoutAddAddressComponent, CheckoutDeleteModalComponent],
  templateUrl: './checkout-address.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutAddressComponent {
  // --- state -----------------------------------------------------------
  view = signal<CheckoutAddressView>('list');

  addresses = signal<CheckoutAddress[]>([
    {
      id: 'addr-1',
      label: 'Home',
      city: 'Giza',
      addressLine: '21 Ahmed Mohamed St., King Faisal St., Giza',
      phoneCountryCode: '+20',
      phone: '1012345678',
    },
    {
      id: 'addr-2',
      label: 'Work',
      city: 'Cairo',
      addressLine: '14 Omar Ibn Akhatab St., Ramsis St., Cairo',
      phoneCountryCode: '+20',
      phone: '1112345678',
    },
    {
      id: 'addr-3',
      label: 'Family',
      city: 'Alexandria',
      addressLine: '16 El-Gaish Rd, San Stefano, El-Raml 2, Alexandria',
      phoneCountryCode: '+20',
      phone: '1512345678',
    },
  ]);

  editingAddress = signal<CheckoutAddress | null>(null);
  deletingAddress = signal<CheckoutAddress | null>(null);

  // --- derived -----------------------------------------------------------
  /** Groups addresses by their label (Home / Work / Family / ...) preserving insertion order */
  groupedAddresses = computed(() => {
    const groups = new Map<string, CheckoutAddress[]>();
    for (const address of this.addresses()) {
      const bucket = groups.get(address.label) ?? [];
      bucket.push(address);
      groups.set(address.label, bucket);
    }
    return Array.from(groups.entries()).map(([label, items]) => ({ label, items }));
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

  onWizardSaved(value: CheckoutAddressFormValue): void {
    if (value.id) {
      this.addresses.update((current) =>
        current.map((address) => (address.id === value.id ? { ...address, ...value, id: value.id! } : address)),
      );
    } else {
      this.addresses.update((current) => [...current, { ...value, id: crypto.randomUUID() }]);
    }
    this.editingAddress.set(null);
    this.view.set('list');
  }
}

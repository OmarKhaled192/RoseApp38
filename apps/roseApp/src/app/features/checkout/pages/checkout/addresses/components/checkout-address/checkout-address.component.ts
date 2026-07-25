import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CheckoutAddressItemComponent } from '../checkout-address-item/checkout-address-item.component';
import { CheckoutAddAddressComponent } from '../checkout-add-address/checkout-add-address.component';
import { CheckoutDeleteModalComponent } from '../checkout-delete-modal/checkout-delete-modal.component';
import {
  CheckoutAddress,
  CheckoutAddressListPayload,
  CheckoutAddressView,
  CheckoutAddressWizardValue,
} from '../../models/checkout-address.model';
import { CheckoutAddressService } from '../../services/checkout-address.service';
import { CheckoutAddressFacade } from '../../services/checkout-address-facade.service';
import { Router } from '@angular/router';
import { OrderStore } from '../../../../../state/orderStore';

/**
 * NOTE: `CheckoutAddress` (from the model file) is assumed to already carry
 * `label: string` (e.g. "Home" / "Work" / "Family") and `isDefault: boolean`.
 * If those fields don't exist on the model yet, add them there instead of
 * widening the type here — that keeps the whole feature strongly typed.
 */

interface CheckoutAddressGroup {
  label: string;
  addresses: CheckoutAddress[];
}

const UNLABELED_GROUP = 'Other';

@Component({
  selector: 'app-checkout-address',
  imports: [CheckoutAddressItemComponent, CheckoutAddAddressComponent, CheckoutDeleteModalComponent],
  templateUrl: './checkout-address.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutAddressComponent {
  private readonly checkoutAddressService = inject(CheckoutAddressService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly checkoutAddressFacade = inject(CheckoutAddressFacade);
  private readonly router = inject(Router);
  readonly orderStore = inject(OrderStore);

  private readonly addressResources = this.checkoutAddressService
    .getListResourceData<CheckoutAddressListPayload>();

  view = signal<CheckoutAddressView>('list');
  addresses = signal<CheckoutAddress[]>([]);
  selectedAddressId = signal<string | null>(null);

  editingAddress = signal<CheckoutAddress | null>(null);
  deletingAddress = signal<CheckoutAddress | null>(null);

  isDeleteModalOpen = computed(() => this.deletingAddress() !== null);

  // Groups addresses by their `label` (Home / Work / Family / ...), preserving
  // first-seen order so the UI order matches whatever order the API returns.
  groupedAddresses = computed<CheckoutAddressGroup[]>(() => {
    const groups: CheckoutAddressGroup[] = [];
    const indexByLabel = new Map<string, number>();

    for (const address of this.addresses()) {
      const label = address.title ?? UNLABELED_GROUP;
      let idx = indexByLabel.get(label);

      if (idx === undefined) {
        idx = groups.length;
        indexByLabel.set(label, idx);
        groups.push({ label, addresses: [] });
      }

      groups[idx].addresses.push(address);
    }

    return groups;
  });

  constructor() {
    effect(() => {
      const addresses = this.addressResources.value()?.payload.addresses ?? [];
      this.addresses.set(addresses);
      if (!this.selectedAddressId() && addresses.length > 0) {
        const defaultAddress = addresses.find(a => a.isPrimary) || addresses[0];
        this.selectedAddressId.set(defaultAddress.id ?? null);
      }
    });
  }

  hasDefault(group: CheckoutAddressGroup): boolean {
    return group.addresses.some((a) => a.isPrimary);
  }

  isDefaultAddress(address: CheckoutAddress): boolean {
    return !!address?.isPrimary;
  }

  selectAddress(address: CheckoutAddress): void {
    this.selectedAddressId.set(address.id ?? null);
  }

  onNext(): void {
    const addressId = this.selectedAddressId();
    if (addressId) {
      this.orderStore.updateAddressId(addressId);
      this.router.navigate(['/roseApp/checkout/payment']);
    }
  }

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
    this.confirmDeleteTarget(target);
  }

  confirmDeleteTarget(target: CheckoutAddress): void {
    this.checkoutAddressService
      .delete<unknown>(target.id ?? '')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.deletingAddress.set(null);
          this.addressResources.reload();
        },
        error: () => {
          this.deletingAddress.set(null);
        },
      });
  }

  cancelDelete(): void {
    this.deletingAddress.set(null);
  }

  onWizardCancelled(): void {
    this.editingAddress.set(null);
    this.view.set('list');
  }

  onWizardSaved(value: CheckoutAddressWizardValue): void {
    this.checkoutAddressFacade
      .saveAddress(value)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.editingAddress.set(null);
          this.view.set('list');
          this.addressResources.reload();
        },
        error: () => {
          this.editingAddress.set(null);
          this.view.set('list');
        },
      });
  }
}

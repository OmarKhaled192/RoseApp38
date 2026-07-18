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
import { map } from 'rxjs';
import { CheckoutAddressItemComponent } from '../checkout-address-item/checkout-address-item.component';
import { CheckoutAddAddressComponent } from '../checkout-add-address/checkout-add-address.component';
import { CheckoutDeleteModalComponent } from '../checkout-delete-modal/checkout-delete-modal.component';
import { CheckoutAddress, CheckoutAddressListPayload, CheckoutAddressView, CheckoutAddressWizardValue } from '../../models/checkout-address.model';
import { CheckoutAddressService } from '../../services/checkout-address.service';


@Component({
  selector: 'app-checkout-address',
  imports: [CheckoutAddressItemComponent, CheckoutAddAddressComponent, CheckoutDeleteModalComponent],
  templateUrl: './checkout-address.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutAddressComponent {
  private readonly checkoutAddressService = inject(CheckoutAddressService);
  private readonly destroyRef = inject(DestroyRef);

  // --- resource -----------------------------------------------------------
  // Created once as a field initializer so it's in a valid injection context.
  private readonly addressResources = this.checkoutAddressService
    .getListResourceData<CheckoutAddressListPayload>();

  // --- state -----------------------------------------------------------
  view = signal<CheckoutAddressView>('list');

  addresses = signal<CheckoutAddress[]>([]);

  editingAddress = signal<CheckoutAddress | null>(null);
  deletingAddress = signal<CheckoutAddress | null>(null);

  // --- derived -----------------------------------------------------------
  isDeleteModalOpen = computed(() => this.deletingAddress() !== null);

  constructor() {
    // Keeps `addresses` in sync with the resource's current value.
    // Reruns automatically whenever addressResources.value() changes,
    // including after addressResources.reload().
    effect(() => {
      const addresses = this.addressResources.value()?.payload.addresses ?? [];
      this.addresses.set(addresses);
    });
  }

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

    this.checkoutAddressService
      .delete<unknown>(target.id ?? "")
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

  // --- wizard actions -----------------------------------------------------------
  onWizardCancelled(): void {
    this.editingAddress.set(null);
    this.view.set('list');
  }

  onWizardSaved(value: CheckoutAddressWizardValue): void {
    const nextAddress: CheckoutAddress = {
      // ...(value.id ? { id: value.id } : {}),
      title: value.title,
      isPrimary: value.isPrimary ?? false,
      city: value.city,
      street: value.street,
      phone: value.phone,
      latitude: value.latitude,
      longitude: value.longitude,
    };

    const request$ = value.id
      ? this.checkoutAddressService.patch<CheckoutAddress, CheckoutAddress>(value.id ?? "", nextAddress)
      : this.checkoutAddressService.post<CheckoutAddress, CheckoutAddress>(nextAddress).pipe(
        map((response) => response.payload),
      );

    request$
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

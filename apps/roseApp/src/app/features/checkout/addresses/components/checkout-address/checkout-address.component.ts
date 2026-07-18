import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  Injector,
  inject,
  runInInjectionContext,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { CheckoutAddressItemComponent } from '../checkout-address-item/checkout-address-item.component';
import { CheckoutAddAddressComponent } from '../checkout-add-address/checkout-add-address.component';
import { CheckoutDeleteModalComponent } from '../checkout-delete-modal/checkout-delete-modal.component';
import { CheckoutAddress } from '../../models/checkout-address.model';
import { CheckoutAddressService } from '../../services/checkout-address.service';

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
  private readonly checkoutAddressService = inject(CheckoutAddressService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly injector = inject(Injector);

  // --- state -----------------------------------------------------------
  view = signal<CheckoutAddressView>('list');

  addresses = signal<CheckoutAddress[]>([]);

  editingAddress = signal<CheckoutAddress | null>(null);
  deletingAddress = signal<CheckoutAddress | null>(null);

  constructor() {
    this.loadAddresses();
  }

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

  private loadAddresses(): void {
    this.checkoutAddressService
      .getList<CheckoutAddress>()
      .pipe(
        map((response) => response.payload?.data ?? []),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (addresses) => this.addresses.set(addresses),
        error: () => this.addresses.set([]),
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

    // onClick handlers run outside Angular's injection context, so
    // takeUntilDestroyed() needs to be re-established manually here.
    runInInjectionContext(this.injector, () => {
      this.checkoutAddressService
        .delete<unknown>(`/${target.id}`)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.addresses.update((current) => current.filter((address) => address.id !== target.id));
            this.deletingAddress.set(null);
          },
          error: () => {
            this.deletingAddress.set(null);
          },
        });
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
      ...(value.id ? { id: value.id } : {}),
      title: value.title,
      isPrimary: value.isPrimary ?? false,
      city: value.city,
      street: value.street,
      phone: value.phone,
      latitude: value.latitude,
      longitude: value.longitude,
    };

    const request$ = value.id
      ? this.checkoutAddressService.put<CheckoutAddress, CheckoutAddress>(nextAddress, `/${nextAddress.id}`)
      : this.checkoutAddressService.post<CheckoutAddress, CheckoutAddress>(nextAddress).pipe(
        map((response) => response.payload),
      );

    // Same reasoning as confirmDelete(): this method is invoked from a
    // template event listener, not from a constructor/factory, so
    // takeUntilDestroyed() needs an explicit injection context.
    runInInjectionContext(this.injector, () => {
      request$
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (savedAddress) => {
            if (value.id) {
              this.addresses.update((current) =>
                current.map((address) => (address.id === savedAddress.id ? savedAddress : address)),
              );
            } else {
              this.addresses.update((current) => [...current, savedAddress]);
            }

            this.editingAddress.set(null);
            this.view.set('list');
          },
          error: () => {
            this.editingAddress.set(null);
            this.view.set('list');
          },
        });
    });
  }
}

import { ChangeDetectionStrategy, Component, computed, effect, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CheckoutFindLocationComponent } from '../checkout-find-location/checkout-find-location.component';
import { CheckoutAddress, CheckoutAddressLabel } from '../../models/checkout-address.model';

type WizardStep = 1 | 2;
type CheckoutAddressLocation = { lat: number; lng: number };
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
  selector: 'app-checkout-add-address',
  imports: [FormsModule, CheckoutFindLocationComponent],
  templateUrl: './checkout-add-address.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutAddAddressComponent {
  /** 'add' shows "Add a New Address" copy, 'edit' shows "Update Address Info" copy */
  mode = input<'add' | 'edit'>('add');
  /** Pass the existing address when mode = 'edit' to pre-fill the form */
  initialAddress = input<CheckoutAddress | null>(null);

  saved = output<CheckoutAddressWizardValue>();
  cancelled = output<void>();

  step = signal<WizardStep>(1);

  city = signal<string>('');
  street = signal<string>('');
  phone = signal<string>('');
  title = signal<CheckoutAddressLabel>('Home');

  heading = computed(() => (this.mode() === 'edit' ? 'Update Address Info' : 'Add a New Address'));
  submitLabel = computed(() => (this.mode() === 'edit' ? 'Save Changes' : 'Add Address'));

  initialLocation = computed(() => {
    const existing = this.initialAddress();

    if (!existing || existing.latitude === undefined || existing.longitude === undefined) {
      return null;
    }

    return { lat: existing.latitude, lng: existing.longitude };
  });

  isStep1Valid = computed(
    () => this.city().trim().length > 0 && this.street().trim().length > 0 && this.phone().trim().length > 0,
  );

  constructor() {
    effect(() => {
      const existing = this.initialAddress();
      if (existing) {
        this.city.set(existing.city);
        this.street.set(existing.street);
        this.phone.set(existing.phone);
        this.title.set(existing.title);
      }
    });
  }

  goToLocationStep(): void {
    if (this.isStep1Valid()) {
      this.step.set(2);
    }
  }

  backToDetailsStep(): void {
    this.step.set(1);
  }

  onCancel(): void {
    this.cancelled.emit();
  }

  onLocationSubmitted(geo: CheckoutAddressLocation): void {
    this.saved.emit({
      id: this.initialAddress()?.id,
      title: this.title(),
      isPrimary: this.initialAddress()?.isPrimary ?? false,
      city: this.city().trim(),
      street: this.street().trim(),
      phone: this.phone().trim(),
      latitude: geo.lat,
      longitude: geo.lng,
    });
  }
}

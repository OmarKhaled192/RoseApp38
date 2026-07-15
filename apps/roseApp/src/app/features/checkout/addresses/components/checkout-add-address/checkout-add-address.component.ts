import { ChangeDetectionStrategy, Component, computed, effect, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CheckoutFindLocationComponent } from '../checkout-find-location/checkout-find-location.component';
import { CheckoutAddress, CheckoutAddressFormValue, CheckoutAddressGeo } from '../../models/checkout-address.model';

type WizardStep = 1 | 2;

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

  saved = output<CheckoutAddressFormValue>();
  cancelled = output<void>();

  step = signal<WizardStep>(1);

  city = signal<string>('');
  addressLine = signal<string>('');
  phoneCountryCode = signal<string>('EG(+20)');
  phone = signal<string>('');
  label = signal<string>('Home');

  heading = computed(() => (this.mode() === 'edit' ? 'Update Address Info' : 'Add a New Address'));
  submitLabel = computed(() => (this.mode() === 'edit' ? 'Save Changes' : 'Add Address'));

  isStep1Valid = computed(
    () => this.city().trim().length > 0 && this.addressLine().trim().length > 0 && this.phone().trim().length > 0,
  );

  constructor() {
    effect(() => {
      const existing = this.initialAddress();
      if (existing) {
        this.city.set(existing.city);
        this.addressLine.set(existing.addressLine);
        this.phoneCountryCode.set(existing.phoneCountryCode);
        this.phone.set(existing.phone);
        this.label.set(existing.label);
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

  onLocationSubmitted(geo: CheckoutAddressGeo): void {
    this.saved.emit({
      id: this.initialAddress()?.id,
      label: this.label(),
      city: this.city().trim(),
      addressLine: this.addressLine().trim(),
      phoneCountryCode: this.phoneCountryCode(),
      phone: this.phone().trim(),
      geo,
    });
  }
}

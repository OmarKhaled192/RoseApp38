import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { CheckoutAddressGeo } from '../../models/checkout-address.model';

@Component({
  selector: 'app-checkout-find-location',
  templateUrl: './checkout-find-location.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutFindLocationComponent {
  heading = input<string>('Add a New Address');
  submitLabel = input<string>('Add Address');
  initialGeo = input<CheckoutAddressGeo | null>(null);

  back = output<void>();
  submitted = output<CheckoutAddressGeo>();

  locating = signal<boolean>(false);
  selectedGeo = signal<CheckoutAddressGeo | null>(null);

  private readonly cairoFallback: CheckoutAddressGeo = { lat: 30.0626, lng: 31.2497 };

  constructor() {
    const initial = this.initialGeo();
    if (initial) {
      this.selectedGeo.set(initial);
    }
  }

  onFindMyLocation(): void {
    this.locating.set(true);

    if (!('geolocation' in navigator)) {
      this.selectedGeo.set(this.cairoFallback);
      this.locating.set(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.selectedGeo.set({ lat: position?.coords?.latitude, lng: position?.coords?.longitude });
        this.locating.set(false);
      },
      () => {
        this.selectedGeo.set(this.cairoFallback);
        this.locating.set(false);
      },
    );
  }

  /** Lets the user drop/adjust the pin by clicking anywhere on the map surface */
  onMapClick(): void {
    if (!this.selectedGeo()) {
      this.selectedGeo.set(this.cairoFallback);
    }
  }

  onMapKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.onMapClick();
    }
  }

  onBack(): void {
    this.back.emit();
  }

  onSubmit(): void {
    this.submitted.emit(this.selectedGeo() ?? this.cairoFallback);
  }
}

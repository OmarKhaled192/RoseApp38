import { inject, Injectable } from "@angular/core";
import { CheckoutAddressService } from "./checkout-address.service";
import { CheckoutAddress, CheckoutAddressWizardValue } from "../models/checkout-address.model";
import { map, Observable } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class CheckoutAddressFacade {
  private readonly checkoutAddressService = inject(CheckoutAddressService);

  saveAddress(
    value: CheckoutAddressWizardValue
  ): Observable<CheckoutAddress> {
    const address: CheckoutAddress = {
      title: value.title,
      isPrimary: value.isPrimary ?? false,
      city: value.city,
      street: value.street,
      phone: value.phone,
      latitude: value.latitude,
      longitude: value.longitude,
    };

    if (value.id) {
      return this.checkoutAddressService.patch<CheckoutAddress, CheckoutAddress>(
        value.id,
        address
      );
    }

    return this.checkoutAddressService
      .post<CheckoutAddress, CheckoutAddress>(address)
      .pipe(map((response) => response.payload));
  }
}

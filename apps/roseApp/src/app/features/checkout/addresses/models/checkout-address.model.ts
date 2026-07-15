export type CheckoutAddressLabel = 'Home' | 'Work' | 'Family' | string;

export interface CheckoutAddressGeo {
  lat: number;
  lng: number;
}

export interface CheckoutAddress {
  id: string;
  label: CheckoutAddressLabel;
  city: string;
  addressLine: string;
  phoneCountryCode: string; // e.g. 'EG(+20)'
  phone: string;
  geo?: CheckoutAddressGeo;
}

/** Payload emitted by the add/edit wizard once both steps are completed */
export type CheckoutAddressFormValue = Omit<CheckoutAddress, 'id'> & { id?: string };

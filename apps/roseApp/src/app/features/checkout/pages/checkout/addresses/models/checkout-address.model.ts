export type CheckoutAddressLabel = 'Home' | 'Work' | 'Family' | string;
export type WizardStep = 1 | 2;
export type CheckoutAddressLocation = { lat: number; lng: number };

export interface CheckoutAddressGeo {
  lat: number,
  lng: number
}

export type CheckoutAddressView = 'list' | 'add' | 'edit';

export type CheckoutAddressWizardValue = {
  id?: string;
  title: string;
  isPrimary?: boolean;
  city: string;
  street: string;
  phone: string;
  latitude: number;
  longitude: number;
};
export interface CheckoutAddress {
  id?: string | undefined;
  title: CheckoutAddressLabel;
  isPrimary: boolean;
  city: string;
  street: string;
  phone: string;
  latitude: number,
  longitude: number
}

export interface CheckoutAddressListPayload {
  addresses: CheckoutAddress[];
}

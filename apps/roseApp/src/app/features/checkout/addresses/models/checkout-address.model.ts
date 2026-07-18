export type CheckoutAddressLabel = 'Home' | 'Work' | 'Family' | string;

export interface CheckoutAddressGeo {
  lat: number,
  lng: number
}

export interface CheckoutAddress {
  id?: string;
  title: CheckoutAddressLabel;
  isPrimary: boolean;
  city: string;
  street: string;
  phone: string;
  latitude: number,
  longitude: number
}

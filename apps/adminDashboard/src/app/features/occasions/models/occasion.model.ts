export interface Occasion {
  id: string;
  name: string;
  products: number;
  image?: string;
}

export interface CreateOccasionPayload {
  name: string;
  image?: string | File;
}

export type UpdateOccasionPayload = Partial<CreateOccasionPayload>;
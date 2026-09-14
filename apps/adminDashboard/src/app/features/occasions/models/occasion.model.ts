export interface Occasion {
  id: string;
  name?: string;
  title?: string;
  products?: number;
  _count?: {
    products?: number;
  };
  image?: string;
}

export interface CreateOccasionPayload {
  name: string;
  image?: string | File;
}

export type UpdateOccasionPayload = Partial<CreateOccasionPayload>;
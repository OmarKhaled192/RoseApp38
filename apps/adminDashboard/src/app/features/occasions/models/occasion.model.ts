export interface Occasion {
  id: string;
  name?: string;
  title?: string;
  description?: string;
  products?: number;
  _count?: {
    products?: number;
  };
  image?: string;
}

export interface CreateOccasionPayload {
  title: string;
  description?: string;
  image?: string | File;
}

export interface IOccasion {
occasion:Occasion
}

export type UpdateOccasionPayload = Partial<CreateOccasionPayload>;
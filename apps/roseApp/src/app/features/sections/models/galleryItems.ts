export type GalleryItemType =
  | 'large'
  | 'small'
  | 'wide'
  | 'tall';

export interface GalleryItem {
  image: string;
  class?: GalleryItemType;
}

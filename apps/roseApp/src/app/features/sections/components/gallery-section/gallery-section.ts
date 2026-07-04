import { Component } from '@angular/core';
import { TitleSection } from '@org/ui';
import { GalleryItem } from '../../models/galleryItems';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-gallery-section',
  imports: [TitleSection, TranslatePipe],
  templateUrl: './gallery-section.html',
  styleUrl: './gallery-section.css',
})
export class GallerySection {
  // gallery: GalleryItem[] = [
  //   {
  //     image: 'https://picsum.photos/600/900?random=1',
  //     class: 'large',
  //   },
  //   {
  //     image: 'https://picsum.photos/600/420?random=2',
  //   },
  //   {
  //     image: 'https://picsum.photos/600/420?random=3',
  //   },
  //   {
  //     image: 'https://picsum.photos/600/420?random=4',
  //     class: 'large'
  //   },
  //   {
  //     image: 'https://picsum.photos/600/420?random=5',
  //     class: 'large'
  //   },
  //   {
  //     image: 'https://picsum.photos/600/420?random=6',
  //   },
  // ];
  gallery: GalleryItem[] = [
    {
      image: '/images/galleries/first.png',
      class: 'large',
    },
    {
      image: '/images/galleries/third.png',
    },
    {
      image: '/images/galleries/fifth.png',
    },
    {
      image: '/images/galleries/fourth.png',
      class: 'large'
    },
    {
      image: '/images/galleries/sixth.png',
      class: 'large'
    },
    {
      image: '/images/galleries/second.png',
    },
  ];
}

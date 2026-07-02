import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { TrustedCompany } from '../../models/trustedBy.interface';

@Component({
  selector: 'app-trusted-by',
  imports: [TranslatePipe],
  templateUrl: './trusted-by.html',
  styleUrl: './trusted-by.css',
})
export class TrustedBy {

    companies: TrustedCompany[] = [
    { src: 'images/one.png', alt: 'Coconut' },
    { src: 'images/two.png', alt: 'Ginyard' },
    { src: 'images/three.png', alt: 'Ingoude Company' },
    { src: 'images/four.png', alt: 'Velvet' },
    { src: 'images/five.png', alt: 'Ingoude Comfort' },
    { src: 'images/6.png', alt: 'Habus Furniture' },
  ];


}

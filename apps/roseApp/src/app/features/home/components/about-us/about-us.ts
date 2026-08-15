import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { DarkModeService } from '@org/ui';

@Component({
  selector: 'app-about-us',
  imports: [CommonModule, TranslatePipe],
  templateUrl: './about-us.html',
})
export class AboutUs implements OnInit {
  dir: WritableSignal<string> = signal('ltr');
  private readonly darkModeService = inject(DarkModeService);
  readonly isDark = this.darkModeService.isDark;
  mainImage = 'assets/images/gift-box-main.jpg';
  topRightImage = 'assets/images/gift-confetti.jpg';
  bottomRightImage = 'assets/images/gift-balloons.jpg';
  features: string[] = [
    'aboutUs.features.competitivePrices',
    'aboutUs.features.premiumQuality',
    'aboutUs.features.perfectOccasion',
    'aboutUs.features.fastDelivery',
  ];
  ngOnInit(): void {
    const dir = document.documentElement.dir.toLowerCase();
    this.dir.set(dir === 'rtl' ? 'rtl' : 'ltr');
  }
}

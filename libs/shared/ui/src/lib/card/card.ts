import { Component, computed, input, output } from '@angular/core';
import { BadgeType, CardAction, CardData } from '../../models/card-type';
import { NgClass } from '@angular/common';

@Component({
  selector: 'lib-card',
  imports: [NgClass],
  templateUrl: './card.html'
})
export class Card {

  card = input.required<CardData>();

  hoverActions = input<CardAction[]>([]);

  footerActions = input<CardAction[]>([]);

  actionClick = output<string>();

  stars = computed(() => {
    const rating = Math.round(this.card().rating ?? 0);
    return Array.from({ length: 5 }, (_, i) => (i < rating ? 'full' : 'empty'));
  });

  badgeClass(badge: BadgeType): Record<string, boolean> {
    const map: Record<string, string> = {
      new: 'bg-emerald-100 text-emerald-700',
      sale: 'bg-rose-100 text-rose-700',
      hot: 'bg-orange-100 text-orange-700',
      'out-of-stock': 'bg-gray-100 text-gray-500',
    };
    return { [map[badge] ?? 'bg-gray-100 text-gray-600']: true };
  }

  badgeLabel(badge: BadgeType): string {
    const map: Record<string, string> = {
      new: 'NEW', sale: 'SALE', hot: 'HOT', 'out-of-stock': 'OUT',
    };
    return map[badge] ?? badge.toUpperCase();
  }

}

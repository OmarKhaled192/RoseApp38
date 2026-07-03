import { Component, computed, input } from '@angular/core';
import { BadgeType, CardAction, CardData } from '../../models/card-type';
import { NgClass } from '@angular/common';
import { StarRating } from '../star-rating/star-rating';

@Component({
  selector: 'lib-card',
  imports: [NgClass, StarRating],
  templateUrl: './card.html',
})
export class Card {
  card = input.required<CardData>();

  hoverActions = input<CardAction[]>([]);

  footerActions = input<CardAction[]>([]);

  badgeClass(badge: string): string {
    const variants: Record<string, string> = {
      new: 'bg-white text-gray-700 border border-gray-200',
      hot: 'bg-[#E65073] text-white',
      'out-of-stock': 'bg-[#A6252A] text-white',
    };
    return variants[badge] ?? 'bg-white text-gray-700 border border-gray-200';
  }

  badgeLabel(badge: BadgeType): string {
    const map: Record<string, string> = {
      new: 'NEW',
      sale: 'SALE',
      hot: 'HOT',
      'out-of-stock': 'OUT',
    };
    return map[badge] ?? badge.toUpperCase();
  }
}

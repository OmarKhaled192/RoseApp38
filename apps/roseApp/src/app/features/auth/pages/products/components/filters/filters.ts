import { Component, effect, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterSection } from '../filter-section/filter-section';
import { TranslatePipe } from '@ngx-translate/core';
import { OccasionItem, ProductFilters } from '../../models/products.models';

@Component({
  selector: 'app-filters',
  imports: [CommonModule, FilterSection, TranslatePipe],
  templateUrl: './filters.html',
})
export class Filters {
  occasions = input.required<OccasionItem[]>();

  /** Current filter state, owned by the parent (Products). */
  value = input<ProductFilters>({
    categoryId: null,
    occasionIds: [],
    rating: null,
    priceFrom: null,
    priceTo: null,
  });

  filtersChange = output<ProductFilters>();
  resetAll = output<void>();

  readonly stars = [1, 2, 3, 4, 5];

  selectedOccasions = signal<string[]>([]);
  selectedRating = signal<number | null>(null);
  priceFrom = signal<number | null>(null);
  priceTo = signal<number | null>(null);

  constructor() {
    // keep local editable state in sync whenever the parent resets/changes the value input
    effect(() => {
      const v = this.value();
      this.selectedOccasions.set(v.occasionIds ?? []);
      this.selectedRating.set(v.rating ?? null);
      this.priceFrom.set(v.priceFrom ?? null);
      this.priceTo.set(v.priceTo ?? null);
    });
  }

  toggleOccasion(id: string) {
    const current = this.selectedOccasions();
    this.selectedOccasions.set(
      current.includes(id) ? current.filter((o) => o !== id) : [...current, id]
    );
    this.emitChange();
  }

  setRating(rating: number) {
    this.selectedRating.set(this.selectedRating() === rating ? null : rating);
    this.emitChange();
  }

  onPriceFromChange(raw: string) {
    this.priceFrom.set(raw === '' ? null : Number(raw));
    this.emitChange();
  }

  onPriceToChange(raw: string) {
    this.priceTo.set(raw === '' ? null : Number(raw));
    this.emitChange();
  }

  resetOccasions() {
    this.selectedOccasions.set([]);
    this.emitChange();
  }

  resetRating() {
    this.selectedRating.set(null);
    this.emitChange();
  }

  resetPrice() {
    this.priceFrom.set(null);
    this.priceTo.set(null);
    this.emitChange();
  }

  resetEverything() {
    this.selectedOccasions.set([]);
    this.selectedRating.set(null);
    this.priceFrom.set(null);
    this.priceTo.set(null);
    this.resetAll.emit();
    this.emitChange();
  }

  private emitChange() {
    this.filtersChange.emit({
      categoryId: this.value().categoryId,
      occasionIds: this.selectedOccasions(),
      rating: this.selectedRating(),
      priceFrom: this.priceFrom(),
      priceTo: this.priceTo(),
    });
  }
}

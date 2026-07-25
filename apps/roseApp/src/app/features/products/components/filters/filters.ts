import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterSection } from '../filter-section/filter-section';
import { TranslatePipe } from '@ngx-translate/core';
import { IOccasion, ProductFilters } from '../../models/products.models';

@Component({
  selector: 'app-filters',
  imports: [CommonModule, FilterSection, TranslatePipe],
  templateUrl: './filters.html',
})
export class Filters {
  occasions = input.required<IOccasion[]>();

  /** Current filter state, owned by the parent (Products). */
  value = input<ProductFilters>({
    categoryIds: [],
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
  priceError = signal<string | null>(null);


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
    this.validatePriceRange();
    this.emitChange();
  }

  onPriceToChange(raw: string) {
    this.priceTo.set(raw === '' ? null : Number(raw));
    this.validatePriceRange();
    this.emitChange();
  }

  private validatePriceRange() {
    const from = this.priceFrom();
    const to = this.priceTo();
    if (from != null && to != null && from > to) {
      this.priceError.set('products.filters.priceRangeError');
    } else {
      this.priceError.set(null);
    }
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
    this.priceError.set(null);
    this.emitChange();
  }

  resetAllFilters() {
    this.selectedOccasions.set([]);
    this.selectedRating.set(null);
    this.priceFrom.set(null);
    this.priceTo.set(null);
    this.priceError.set(null);
    this.resetAll.emit();
  }

  private emitChange() {
    this.filtersChange.emit({
      categoryIds: this.value().categoryIds,
      occasionIds: this.selectedOccasions(),
      rating: this.selectedRating(),
      priceFrom: this.priceFrom(),
      priceTo: this.priceTo(),
    });
  }
}

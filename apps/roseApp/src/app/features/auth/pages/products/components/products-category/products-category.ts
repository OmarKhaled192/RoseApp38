import { Component, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterSection } from '../filter-section/filter-section';
import { CategoryItem } from '../../models/products.models';

@Component({
  selector: 'app-products-category',
  imports: [CommonModule, FilterSection],
  templateUrl: './products-category.html',
})
export class ProductsCategory {
  categories = input.required<CategoryItem[]>();
  selectedId = input<string | null>(null);

  categorySelect = output<string | null>();

  visibleItems = computed(() => {
    const rows: { item: CategoryItem; depth: number }[] = [];

    const walk = (list: CategoryItem[], depth: number) => {
      for (const item of list) {
        rows.push({ item, depth });
        if (item.id === this.selectedId() && item.children?.length) {
          walk(item.children, depth + 1);
        }
      }
    };

    walk(this.categories(), 0);
    return rows;
  });

  onSelect(id: string) {
    this.categorySelect.emit(id);
  }
}

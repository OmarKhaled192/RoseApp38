import { Component, computed, input, output } from '@angular/core';
import { NgClass } from '@angular/common';
import { CategoryItem } from '../../models/products.models';

@Component({
  selector: 'app-products-category',
  imports: [NgClass],
  templateUrl: './products-category.html',
})
export class ProductsCategory {
  categories = input.required<CategoryItem[]>();
  selectedId = input<string | null>(null);

  categorySelect = output<string>();

  /** Flattens the tree, expanding only the children of the selected node. */
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

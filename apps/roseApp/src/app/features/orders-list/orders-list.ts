import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface OrderItem {
  id: number;
  name: string;
  price: number;
  qty: number;
  image: string;
  rating: number;
}
@Component({
  selector: 'app-orders-list',
  imports: [CommonModule],
  templateUrl: './orders-list.html',
})
export class OrdersList {
  showAll = false;

  items: OrderItem[] = [
    {
      id: 1,
      name: 'Moko Chocolate Set | Esperance Rose',
      price: 1800,
      qty: 2,
      rating: 5,
      image:
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300',
    },
    {
      id: 2,
      name: 'Moko Chocolate Set | Esperance Rose',
      price: 1800,
      qty: 2,
      rating: 5,
      image:
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300',
    },
    {
      id: 3,
      name: 'Moko Chocolate Set | Esperance Rose',
      price: 1800,
      qty: 1,
      rating: 5,
      image:
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300',
    },
    {
      id: 4,
      name: 'Moko Chocolate Set | Esperance Rose',
      price: 1800,
      qty: 1,
      rating: 5,
      image:
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300',
    },
  ];

  get visibleItems() {
    return this.showAll ? this.items : this.items.slice(0, 2);
  }
}

import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { OrderService } from '../checkout/services/order';
import { Order, OrderMetadata } from './interfaces/order-items';

@Component({
  selector: 'app-orders-list',
  imports: [CommonModule, TranslatePipe],
  templateUrl: './orders-list.html',
})
export class OrdersList implements OnInit {
  private readonly orderService = inject(OrderService);

  orderitems = signal<Order[]>([]);
  metadata = signal<OrderMetadata | null>(null);

  readonly visibleItemCount = 4;
  private readonly expandedOrderIds = signal<Set<string>>(new Set());


  ngOnInit(): void {
    this.orderService.getAllOrders().subscribe({
      next: (res: any) => {
        this.orderitems.set(res.payload.data);
        this.metadata.set(res.payload.metadata);
      }
    });
  }

  statusBadgeClass(status: string): string {
    switch (status) {
      case 'in_progress':
        return 'bg-blue-500';
      case 'canceled':
        return 'bg-red-500';
      case 'done':
        return 'bg-green-500';
      default:
        return 'bg-blue-400';
    }
  }

  isOrderExpanded(orderId: string): boolean {
    return this.expandedOrderIds().has(orderId);
  }

  toggleOrderExpanded(orderId: string): void {
    const next = new Set(this.expandedOrderIds());
    if (next.has(orderId)) {
      next.delete(orderId);
    } else {
      next.add(orderId);
    }
    this.expandedOrderIds.set(next);
  }
}

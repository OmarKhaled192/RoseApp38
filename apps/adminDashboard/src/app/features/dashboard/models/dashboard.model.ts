import { QueryParams } from '@org/data-access';

export type RevenuePeriod = 'monthly' | 'week';

export interface DashboardQuery extends QueryParams {
  revenuePeriod: RevenuePeriod;
  lowStockThreshold: number;
  topProductsLimit: number;
  lowStockLimit: number;
}

export interface DashboardSummary {
  totalProducts: number;
  totalOrders: number;
  totalCategories: number;
  totalRevenue: number;
  currency: string;
}

export interface DashboardCategory {
  id: string;
  title: string;
  productCount: number;
}

export interface OrderStatusItem {
  count: number;
  percent: number;
}

export interface DashboardOrderStatus {
  completed: OrderStatusItem;
  inProgress: OrderStatusItem;
  canceled: OrderStatusItem;
  totalOrders: number;
}

export interface RevenuePoint {
  period: string;
  label: string;
  revenue: number;
}

export interface DashboardRevenue {
  period: RevenuePeriod;
  points: RevenuePoint[];
}

export interface TopSellingProduct {
  productId: string;
  title: string;
  unitPrice: number;
  totalSales: number;
}

export interface LowStockProduct {
  id: string;
  title: string;
  stock: number;
}

export interface DashboardPayload {
  summary: DashboardSummary;
  categories: DashboardCategory[];
  orderStatus: DashboardOrderStatus;
  revenue: DashboardRevenue;
  topSellingProducts: TopSellingProduct[];
  lowStockProducts: LowStockProduct[];
}

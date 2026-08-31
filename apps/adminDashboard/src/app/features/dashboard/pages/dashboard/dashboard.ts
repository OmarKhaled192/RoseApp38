import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { UIChart } from 'primeng/chart';
import { DashboardStore } from '../../state/dashboard.store';
import { RevenuePeriod } from '../../models/dashboard.model';

interface DashboardChartPlugin<TChart> {
  id: string;
  afterDatasetsDraw: (chart: TChart) => void;
}

interface DoughnutArc {
  startAngle: number;
  endAngle: number;
  outerRadius: number;
  x: number;
  y: number;
}

interface DoughnutChartInstance {
  ctx: CanvasRenderingContext2D;
  data: { datasets: Array<{ data: number[] }> };
  getDatasetMeta: (index: number) => { data: DoughnutArc[] };
}

interface LinePoint {
  x: number;
  y: number;
}

interface LineChartInstance {
  ctx: CanvasRenderingContext2D;
  data: { datasets: Array<{ data: number[] }> };
  getDatasetMeta: (index: number) => { data: LinePoint[] };
}

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, UIChart],
  templateUrl: './dashboard.html',
})
export class Dashboard {
  readonly dashboardStore = inject(DashboardStore);

  readonly orderStatusChartData = computed(() => {
    const status = this.dashboardStore.orderStatus();

    return {
      labels: ['Completed', 'In progress', 'Canceled'],
      datasets: [
        {
          data: [
            status?.completed.count ?? 0,
            status?.inProgress.count ?? 0,
            status?.canceled.count ?? 0,
          ],
          backgroundColor: ['#10b981', '#3b82f6', '#ef4444'],
          hoverBackgroundColor: ['#059669', '#2563eb', '#dc2626'],
          borderWidth: 0,
        },
      ],
    };
  });

  readonly orderStatusChartOptions = {
    cutout: '55%',
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  readonly orderStatusChartPlugins: DashboardChartPlugin<DoughnutChartInstance>[] = [
    {
      id: 'orderStatusPercentages',
      afterDatasetsDraw: (chart) => {
        const dataset = chart.data.datasets[0];
        const total = dataset.data.reduce(
          (sum: number, value: number) => sum + value,
          0,
        );

        if (!total) return;

        const context = chart.ctx;
        const arcs = chart.getDatasetMeta(0).data;

        arcs.forEach((arc, index) => {
          const value = dataset.data[index] as number;
          if (!value) return;

          const angle = (arc.startAngle + arc.endAngle) / 2;
          const radius = arc.outerRadius + 7;
          const x = arc.x + Math.cos(angle) * radius;
          const y = arc.y + Math.sin(angle) * radius;
          const percent = Math.round((value / total) * 100);

          context.save();
          context.fillStyle = '#ffffff';
          context.beginPath();
          context.arc(x, y, 14, 0, Math.PI * 2);
          context.fill();
          context.fillStyle = '#1e293b';
          context.font = '600 10px Inter, sans-serif';
          context.textAlign = 'center';
          context.textBaseline = 'middle';
          context.fillText(`${percent}%`, x, y);
          context.restore();
        });
      },
    },
  ];

  readonly revenueChartData = computed(() => {
    const points = this.dashboardStore.revenue()?.points ?? [];
    const values = points.map((point) => point.revenue);
    const highestRevenue = Math.max(...values, 0);

    return {
      labels: points.map((point) => point.label),
      datasets: [
        {
          label: 'Revenue',
          data: values,
          fill: true,
          borderColor: '#dc2626',
          backgroundColor: 'rgba(220, 38, 38, 0.18)',
          borderWidth: 1,
          tension: 0.4,
          pointRadius: values.map((value) =>
            value === highestRevenue && value > 0 ? 5 : 0,
          ),
          pointHoverRadius: 5,
          pointBackgroundColor: '#dc2626',
        },
      ],
    };
  });

  readonly revenueChartOptions = {
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 18,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: { parsed: { y: number | null } }) =>
            `${context.parsed.y ?? 0} EGP`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: '#e2e8f0',
          drawTicks: false,
        },
        border: {
          display: false,
        },
        ticks: {
          color: '#1e293b',
          font: {
            size: 11,
            weight: '600',
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
        ticks: {
          precision: 0,
          color: '#1e293b',
          font: {
            size: 11,
            weight: '600',
          },
        },
      },
    },
  };

  readonly revenueChartPlugins: DashboardChartPlugin<LineChartInstance>[] = [
    {
      id: 'highestRevenueLabel',
      afterDatasetsDraw: (chart) => {
        const values = chart.data.datasets[0].data as number[];
        const highestRevenue = Math.max(...values, 0);
        const index = values.indexOf(highestRevenue);

        if (!highestRevenue || index < 0) return;

        const point = chart.getDatasetMeta(0).data[index];
        const context = chart.ctx;

        context.save();
        context.fillStyle = '#b91c1c';
        context.font = '600 11px Inter, sans-serif';
        context.textAlign = 'center';
        context.fillText(`${highestRevenue} EGP`, point.x, point.y - 15);
        context.restore();
      },
    },
  ];

  setRevenuePeriod(period: RevenuePeriod): void {
    this.dashboardStore.setRevenuePeriod(period);
  }

  formatNumber(value: number): string {
    return new Intl.NumberFormat('en-US').format(value);
  }

  formatCurrency(value: number, currency: string): string {
    return `${new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 0,
    }).format(value)} ${currency}`;
  }
}

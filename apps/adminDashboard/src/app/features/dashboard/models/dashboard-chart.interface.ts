export interface DashboardChartPlugin<TChart> {
  id: string;
  afterDatasetsDraw: (chart: TChart) => void;
}

export interface DoughnutArc {
  startAngle: number;
  endAngle: number;
  outerRadius: number;
  x: number;
  y: number;
}

export interface DoughnutChartInstance {
  ctx: CanvasRenderingContext2D;
  data: { datasets: Array<{ data: number[] }> };
  getDatasetMeta: (index: number) => { data: DoughnutArc[] };
}

export interface LinePoint {
  x: number;
  y: number;
}

export interface LineChartInstance {
  ctx: CanvasRenderingContext2D;
  data: { datasets: Array<{ data: number[] }> };
  getDatasetMeta: (index: number) => { data: LinePoint[] };
}

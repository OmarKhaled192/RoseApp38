import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Pagination } from '@org/ui';
import {
  ResolvedReusableTableColumn,
  ReusableTableAction,
  ReusableTableActionEvent,
  ReusableTableColumn,
  ReusableTableRow,
} from '../../models/reusable-table.models';

const DEFAULT_ACTIONS: readonly ReusableTableAction[] = [
  { name: 'edit', labelName: 'reusable-table.edit', icon: 'pi pi-pencil', tone: 'primary' },
  { name: 'delete', labelName: 'reusable-table.delete', icon: 'pi pi-trash', tone: 'danger' },
];

@Component({
  selector: 'app-reusable-table',
  standalone: true,
  imports: [TranslatePipe, Pagination],
  templateUrl: './reusable-table.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReusableTable<T extends ReusableTableRow = ReusableTableRow> {
  /** Table rows are owned by the parent and are never mutated here. */
  readonly data = input<readonly T[]>([]);
  readonly columns = input.required<readonly ReusableTableColumn[]>();
  readonly emptyMessage = input('reusable-table.empty');
  readonly totalRecords = input(0);
  readonly pageSize = input(10);
  readonly first = input(0);

  /** Emits the complete row and the action/column that caused the click. */
  readonly actionClicked = output<ReusableTableActionEvent<T>>();
  readonly pageChange = output<{ page: number; size: number; first: number }>();

  readonly totalPages = computed(() => {
    const size = this.pageSize();
    if (size <= 0) return 0;
    return Math.ceil(this.totalRecords() / size);
  });

  readonly resolvedColumns = computed<readonly ResolvedReusableTableColumn[]>(() =>
    this.columns().map((column, index) => ({
      ...column,
      suffix: column.suffix ?? '',
      prefix: column.prefix ?? '',
      distinctValuesCondition: column.distinctValuesCondition ?? null,
      frozenColumn: column.frozenColumn ?? false,
      bold: column.bold ?? false,
      suffixBold: column.suffixBold ?? false,
      prefixBold: column.prefixBold ?? false,
      actions: column.actions ?? DEFAULT_ACTIONS,
      // A fixed cell width keeps sticky columns from overlapping while scrolling.
      frozenOffset: index * 176,
    })),
  );

  onAction(action: ReusableTableAction, row: T, column: ReusableTableColumn): void {
    this.actionClicked.emit({ action: action.name, row, column });
  }

  valueOf(row: T, name: string): string {
    const value = row[name];
    return value === null || value === undefined ? '' : String(value);
  }

  isDistinct(value: unknown, condition: ResolvedReusableTableColumn['distinctValuesCondition']): boolean {
    if (!condition || typeof value !== 'number') return false;
    const match = /^(<=|>=|!=|=|<|>)(-?\d+(?:\.\d+)?)$/.exec(condition);
    if (!match) return false;
    const threshold = Number(match[2]);
    switch (match[1]) {
      case '<': return value < threshold;
      case '<=': return value <= threshold;
      case '>': return value > threshold;
      case '>=': return value >= threshold;
      case '=': return value === threshold;
      case '!=': return value !== threshold;
      default: return false;
    }
  }
}

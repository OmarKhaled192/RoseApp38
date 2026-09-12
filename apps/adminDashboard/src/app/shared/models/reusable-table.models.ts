/** A single record rendered by the reusable table. */
export type ReusableTableRow = Record<string, unknown>;

export type ReusableTableColumnType = 'text' | 'number' | 'actions';
export type ReusableTableActionName = 'edit' | 'delete' | 'search' | (string & {});
export type DistinctValuesCondition = `${'<' | '<=' | '>' | '>=' | '=' | '!='}${number}`;

export interface ReusableTableAction {
  /** The semantic action emitted to the parent. */
  name: ReusableTableActionName;
  /** Translation key used for the accessible label and optional visible text. */
  labelName?: string;
  /** PrimeIcons class, for example `pi pi-pencil`. */
  icon?: string;
  /** Visual treatment for the action. */
  tone?: 'primary' | 'danger' | 'neutral';
}

/**
 * Column configuration. Only name, labelName and type are required.
 * `distinctValuesCondition` compares numeric cell values; e.g. '<5'.
 */
export interface ReusableTableColumn {
  name: string;
  labelName: string;
  type: ReusableTableColumnType;
  suffix?: string;
  prefix?: string;
  distinctValuesCondition?: DistinctValuesCondition | null;
  frozenColumn?: boolean;
  bold?: boolean;
  suffixBold?: boolean;
  prefixBold?: boolean;
  actions?: readonly ReusableTableAction[];
}

export interface ReusableTableActionEvent<T extends ReusableTableRow = ReusableTableRow> {
  action: ReusableTableActionName;
  row: T;
  column: ReusableTableColumn;
}

export interface ResolvedReusableTableColumn extends ReusableTableColumn {
  suffix: string;
  prefix: string;
  distinctValuesCondition: DistinctValuesCondition | null;
  frozenColumn: boolean;
  bold: boolean;
  suffixBold: boolean;
  prefixBold: boolean;
  actions: readonly ReusableTableAction[];
  frozenOffset: number;
}

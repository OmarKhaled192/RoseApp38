export interface BaseField {
  key: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  readonly?: boolean;
  row?: number;
}

export type FieldConfig =
  | (BaseField & { type: 'text' | 'email' })
  | (BaseField & { type: 'number' })
  | (BaseField & { type: 'date' })
  | (BaseField & { type: 'checkbox' })
  | (BaseField & { type: 'select'; options: { label: string; value: string }[] })
  | (BaseField & { type: 'textarea'; rows?: number })
  | (BaseField & {
      type: 'upload';
      multiple?: boolean;
      accept?: string;
      maxFileSize?: number; 
    });

export type FieldType = FieldConfig['type'];
export type FieldValueType<T extends FieldType> =
  T extends 'number' ? number :
  T extends 'checkbox' ? boolean :
  T extends 'date' ? Date :
  T extends 'upload' ? File | File[] | null :
  string;
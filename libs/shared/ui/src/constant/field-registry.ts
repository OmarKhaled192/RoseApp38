import { Type } from '@angular/core';
import { FieldType } from '../models/field-types';
import { TextField } from '../lib/dynamic-form/components/text-field/text-field';
import { CheckboxField } from '../lib/dynamic-form/components/checkbox-field/checkbox-field';
import { SelectField } from '../lib/dynamic-form/components/select-field/select-field';
import { TextareaField } from '../lib/dynamic-form/components/textarea-field/textarea-field';
import { UploadField } from '../lib/dynamic-form/components/upload-field/upload-field';

export const FIELD_COMPONENTS: Record<FieldType, Type<any>> = {
  text: TextField,
  number: TextField,
  email: TextField,
  date: TextField,
  checkbox: CheckboxField,
  select: SelectField,
  textarea: TextareaField,
  upload: UploadField,
};
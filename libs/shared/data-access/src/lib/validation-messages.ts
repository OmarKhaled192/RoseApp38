import { Injectable } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';

export interface ValidatorErrorMessageParams {
  validatorName: string;
  validatorValue?: { requiredLength?: number; max?: number; min?: number };
  fieldName?: string;
  enter?: string;
  choose?: string;
  validMail?: string;
  numbers?: string;
  number?: string;
  least?: string;
  maximum?: string;
  pattern?: string;
  englishPatternMsg?: string;
  arabicPatternMsg?: string;
}

type ValidatorMessageConfig = Record<string, string>;

@Injectable({
  providedIn: 'root'
})
export class ValidationMessagesService {
  static getValidatorErrorMessage = (params: ValidatorErrorMessageParams): string => {
    const {
      validatorName,
      validatorValue,
      fieldName,
      enter,
      choose,
      validMail,
      least,
      maximum,
      pattern,
    } = params;

    const config: ValidatorMessageConfig = {
      required: `${enter} ${fieldName}`,
      validChose: `${choose} ${fieldName}`,
      email: validMail ?? '',
      pattern: pattern ?? '',
      minlength: `${enter} ${validatorValue?.requiredLength ?? 0} ${least}`,
      maxlength: `${enter} ${validatorValue?.requiredLength ?? 0} ${maximum}`,
      max: `${enter} ${validatorValue?.max ?? 0} ${maximum}`,
      min: `${enter} ${validatorValue?.min ?? 0} ${least}`
    };

    return config[validatorName] ?? '';
  };

  getMessages = (): Observable<string[]> => {
    return of(['required', 'validChose', 'email', 'pattern', 'minlength', 'maxlength']);
  };

  validateAllFormFields(formGroup: FormArray | FormGroup): void {
    Object.keys(formGroup.controls).forEach((field: string) => {
      const control: AbstractControl | null = formGroup.get(field);

      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      } else if (control instanceof FormArray) {
        control.controls.forEach((nestedControl: AbstractControl) => {
          if (nestedControl instanceof FormGroup || nestedControl instanceof FormArray) {
            this.validateAllFormFields(nestedControl);
          } else if (nestedControl instanceof FormControl) {
            nestedControl.markAsTouched({ onlySelf: true });
          }
        });
      }
    });
  }
}

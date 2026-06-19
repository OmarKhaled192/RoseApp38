import { Component, inject, input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ValidationMessagesService } from '@org/data-access';

@Component({
  selector: 'lib-error-message',
  imports: [],
  templateUrl: './error-message.html',
  styleUrl: './error-message.css',
})
export class ErrorMessage {
  private readonly translate = inject(TranslateService);
  control = input<FormControl>(new FormControl());
  fieldName = input('');

  message = input<string>('');

  get errorMessages(): string | null {
    const firstErrorKey = this.firstTouchedErrorKey;
    if (!firstErrorKey) {
      return null;
    }

    const ctrl = this.control();

    return ValidationMessagesService.getValidatorErrorMessage({
      validatorName: firstErrorKey,
      validatorValue: ctrl.errors![firstErrorKey],
      fieldName: this.fieldName(),
      enter: this.translate.instant('error.enter-plz'),
      choose: this.translate.instant('error.choose-plz'),
      validMail: this.translate.instant('error.valid-mail'),
      numbers: this.translate.instant('error.numbers'),
      number: this.translate.instant('error.number'),
      least: this.translate.instant('error.at-least'),
      maximum: this.translate.instant('error.maximum'),
      pattern: this.translate.instant('error.pattern'),
    });
  }

  private get firstTouchedErrorKey(): string | null {
    const ctrl = this.control();

    if (!ctrl.touched || !ctrl.errors) {
      return null;
    }

    const keys = Object.keys(ctrl.errors);
    return keys.length > 0 ? keys[0] : null;
  }
get errorMessage(): unknown {
  const errors = this.control()?.errors;

  for (const propertyName in errors) {
    if (Object.prototype.hasOwnProperty.call(errors, propertyName) && this.control().touched) {
console.log(errors);

      return ValidationMessagesService.getValidatorErrorMessage({
        validatorName: propertyName,
        validatorValue: errors[propertyName],
        fieldName: this.fieldName(),
        enter: this.translate.instant('error.enter-plz'),
        choose: this.translate.instant('error.choose-plz'),
        validMail: this.translate.instant('error.valid-mail'),
        numbers: this.translate.instant('error.numbers'),
        number: this.translate.instant('error.number'),
        least: this.translate.instant('error.at-least'),
        maximum: this.translate.instant('error.maximum'),
        pattern: this.translate.instant('error.pattern'),
      });
    }
  }

  return null;
}
}


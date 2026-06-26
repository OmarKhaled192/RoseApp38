import { Component, inject, input, signal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ValidationMessagesService } from '@org/data-access';

@Component({
  selector: 'lib-error-message',
  standalone: true,
  imports: [],
  templateUrl: './error-message.html'
})
export class ErrorMessage {
  private readonly translate = inject(TranslateService);
  message = input<string>('');
  control = input.required<FormControl>();
  fieldName = input('');

  private readonly controlStateVersion = signal(0);

get errorMessage(): unknown {
  const errors = this.control()?.errors;

  for (const propertyName in errors) {
    if (Object.prototype.hasOwnProperty.call(errors, propertyName) && this.control().touched) {

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

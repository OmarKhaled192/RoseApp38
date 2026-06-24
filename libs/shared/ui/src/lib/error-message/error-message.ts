import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ValidationMessagesService } from '@org/data-access';
import { merge } from 'rxjs';

@Component({
  selector: 'lib-error-message',
  standalone: true,
  imports: [],
  templateUrl: './error-message.html',
  styleUrl: './error-message.css',
})
export class ErrorMessage {
  private readonly translate = inject(TranslateService);

  control = input.required<FormControl>();
  fieldName = input('');

  private readonly controlStateVersion = signal(0);

  readonly errorMessage = computed(() => {
    this.controlStateVersion();

    const ctrl = this.control();
    if (!ctrl.touched || !ctrl.errors) {
      return null;
    }

    const firstErrorKey = Object.keys(ctrl.errors)[0];
    if (!firstErrorKey) {
      return null;
    }

    return ValidationMessagesService.getValidatorErrorMessage({
      validatorName: firstErrorKey,
      validatorValue: ctrl.errors[firstErrorKey],
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
  });

  constructor() {
    effect((onCleanup) => {
      const ctrl = this.control();
      const subscription = merge(ctrl.statusChanges, ctrl.valueChanges).subscribe(() => {
        this.controlStateVersion.update((version) => version + 1);
      });

      onCleanup(() => subscription.unsubscribe());
    });
  }
}

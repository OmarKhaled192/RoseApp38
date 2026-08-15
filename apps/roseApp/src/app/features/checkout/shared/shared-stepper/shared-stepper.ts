import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-shared-stepper',
  imports: [CommonModule],
  templateUrl: './shared-stepper.html',
})
export class SharedStepper {
  @Input({ required: true }) totalSteps = 2;

  @Input({ required: true }) currentStep = 1;

  get steps(): number[] {
    return Array.from({ length: this.totalSteps }, (_, i) => i + 1);
  }

  isStepActive(step: number): boolean {
    return step <= this.currentStep;
  }

  isSegmentActive(index: number): boolean {
    return index < this.currentStep;
  }
}

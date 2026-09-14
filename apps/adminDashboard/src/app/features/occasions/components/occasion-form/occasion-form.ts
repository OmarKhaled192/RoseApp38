import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Message } from '@org/data-access';
import { DynamicForm, FieldConfig } from '@org/ui';
import { OccasionService } from '../../services/occasion.service';
import { CreateOccasionPayload } from '../../models/occasion.model';

@Component({
  selector: 'app-occasion-form',
  standalone: true,
  imports: [CommonModule, DynamicForm, TranslatePipe],
  templateUrl: './occasion-form.html',
  styleUrl: './occasion-form.css',
})
export class OccasionForm {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly occasionService = inject(OccasionService);
  private readonly translate = inject(TranslateService);
  private readonly message = inject(Message);

  readonly mode = computed<'add' | 'edit'>(() =>
    this.route.snapshot.data['mode'] === 'edit' ? 'edit' : 'add',
  );
  readonly occasionId = computed(() => this.route.snapshot.paramMap.get('id'));

  readonly formTitle = computed(() =>
    this.mode() === 'edit' ? 'dashboard.occasions.editTitle' : 'dashboard.occasions.addTitle',
  );

  readonly submitLabel = computed(() =>
    this.mode() === 'edit' ? 'dashboard.occasions.updateButton' : 'dashboard.occasions.addButton',
  );

  readonly formFields = computed<FieldConfig[]>(() => [
    {
      key: 'name',
      label: this.translate.instant('dashboard.occasions.name'),
      type: 'text',
      required: true,
      placeholder: this.translate.instant('dashboard.occasions.namePlaceholder'),
      row: 1,
    },
    {
      key: 'image',
      label: this.translate.instant('dashboard.occasions.image'),
      type: 'upload',
      required: true,
      accept: 'image/*',
      placeholder: this.translate.instant('dashboard.occasions.imagePlaceholder'),
      row: 2,
    },
  ]);

  onSubmit(data: Record<string, any> | FormData): void {
    const payload = this.toPayload(data);

    if (this.mode() === 'edit' && this.occasionId()) {
      this.occasionService
        .updateOccasion(this.occasionId()!, payload)
        .subscribe({
          next: (response) => {
            this.message.show('success', response.message || 'notifications.occasion.updateSuccess');
            this.router.navigate(['/admin/occasions']);
          },
          error: (error) => this.message.show(
            'error',
            error?.error?.message || 'notifications.occasion.updateFailed',
          ),
        });
      return;
    }

    this.occasionService
      .createOccasion(payload)
      .subscribe({
        next: (response) => {
          this.message.show('success', response.message || 'notifications.occasion.createSuccess');
          this.router.navigate(['/admin/occasions']);
        },
        error: (error) => this.message.show(
          'error',
          error?.error?.message || 'notifications.occasion.createFailed',
        ),
      });
  }

  private toPayload(data: Record<string, any> | FormData): CreateOccasionPayload {
    if (data instanceof FormData) {
      return data as unknown as CreateOccasionPayload;
    }

    return {
      name: typeof data['name'] === 'string' ? data['name'].trim() : '',
      image: data['image'] as string | File | undefined,
    };
  }
}

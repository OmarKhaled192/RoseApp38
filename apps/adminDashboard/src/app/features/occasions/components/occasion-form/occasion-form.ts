import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
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
      label: 'Name',
      type: 'text',
      required: true,
      placeholder: 'Enter occasion name',
      row: 1,
    },
    {
      key: 'image',
      label: 'Occasion image',
      type: 'upload',
      required: true,
      accept: 'image/*',
      row: 2,
    },
  ]);

  onSubmit(data: Record<string, any> | FormData): void {
    const payload = this.toPayload(data);

    if (this.mode() === 'edit' && this.occasionId()) {
      this.occasionService
        .updateOccasion(this.occasionId()!, payload)
        .subscribe(() => this.router.navigate(['/admin/occasions']));
      return;
    }

    this.occasionService
      .createOccasion(payload)
      .subscribe(() => this.router.navigate(['/admin/occasions']));
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

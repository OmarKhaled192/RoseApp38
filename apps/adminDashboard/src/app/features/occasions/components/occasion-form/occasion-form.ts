import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { DataResponse, Message } from '@org/data-access';
import { DynamicForm, FieldConfig, FileUploadFn } from '@org/ui';
import { OccasionService } from '../../services/occasion.service';
import { ProductStore } from '../../../product/state/product.store';
import { map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

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
  private readonly productStore = inject(ProductStore);
  private routeParams = toSignal(this.route.paramMap);
  formValues = signal<Record<string, any>>({});

  occasionId = computed(() => this.routeParams()?.get('id') ?? null);
    readonly occasionResource = this.occasionService.getOccasionDetail(
    computed(() => this.occasionId() ?? '')
  );

  readonly occasion = computed(() => {
    const p = this.occasionResource.value()?.payload.occasion ?? null;
    if (!p) return null;
    return {
      ...p,
    };
  });


  
  mode = computed<'create' | 'update'>(() =>
    this.occasionId() ? 'update' : 'create'
  );

 readonly  formTitle = computed(() => {
    if (this.mode() === 'update') {
      const title = this.occasion()?.title ?? '';
        return `${this.translate.instant('dashboard.occasions.editTitle')}: ${title}`;
    }
    return this.translate.instant('dashboard.occasions.addTitle')
  });


  submitLabel = computed(() =>
    this.mode() === 'update'
      ? this.translate.instant('dashboard.occasions.updateButton')
      : this.translate.instant('dashboard.occasions.addButton')
  );

  readonly formFields = computed<FieldConfig[]>(() => [
    {
      key: 'title',
      label: this.translate.instant('dashboard.occasions.name'),
      type: 'text',
      required: true,
      placeholder: this.translate.instant('dashboard.occasions.namePlaceholder'),
      row: 1,
    },
    {
      key: 'description',
      label: this.translate.instant('dashboard.occasions.description'),
      type: 'textarea',
      required: false,
      placeholder: this.translate.instant('dashboard.occasions.descriptionPlaceholder'),
      row: 2,
    },
    {
      key: 'image',
      label: this.translate.instant('dashboard.occasions.image'),
      type: 'upload',
      required: true,
      accept: 'image/*',
      placeholder: this.translate.instant('dashboard.occasions.imagePlaceholder'),
      row: 3,
    },
  ]);

  
    uploadFn: FileUploadFn = (file: File) => {
      const formData = new FormData();
      formData.append('image', file);
      return this.productStore.uploadPhoto(formData).pipe(
        map(res => (res as unknown as DataResponse<{ url: string }>).payload.url)
      );
    };
  

  onSubmit(data:  Record<string, any>): void {

    if ( this.occasionId()) {
      this.occasionService
        .updateOccasion(this.occasionId()!, data)
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
      .createOccasion(data)
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
}

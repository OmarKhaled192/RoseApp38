import { Component, input, signal } from '@angular/core';
import { FieldTree } from '@angular/forms/signals';
import { FieldConfig } from 'libs/shared/ui/src/models/field-types';
import { FileUploadModule, FileUploadHandlerEvent } from 'primeng/fileupload';
@Component({
  selector: 'lib-upload-field',
  imports: [FileUploadModule],
  templateUrl: './upload-field.html',
  styleUrl: './upload-field.css',

})
export class UploadField {
  field = input.required<Extract<FieldConfig, { type: 'upload' }>>();
  control = input.required<FieldTree<File | File[] | null>>();
  fileNames = signal<string[]>([]);
  private selectedFiles: File[] = [];

  onUpload(event: FileUploadHandlerEvent) {
    this.selectedFiles = event.files;
    this.fileNames.set(event.files.map(f => f.name));

    this.control()().value.set( 
      this.field().multiple ? event.files : (event.files[0] ?? null)
    );
  }
}

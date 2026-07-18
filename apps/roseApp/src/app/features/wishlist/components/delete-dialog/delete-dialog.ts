import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-delete-dialog',
  standalone: true,
  imports: [DialogModule, ButtonModule, TranslatePipe],
  templateUrl: './delete-dialog.html',
})
export class DeleteDialog {
  @Input() visible = false;

  @Output() visibleChange = new EventEmitter<boolean>();

  @Output() confirm = new EventEmitter<void>();

  // Called whenever p-dialog changes its own visibility internally
  // (X icon, mask click, Esc key) — keeps the parent in sync every time.
  onVisibleChange(value: boolean) {
    this.visible = value;
    this.visibleChange.emit(value);
  }

  close() {
    this.onVisibleChange(false);
  }

  delete() {
    this.confirm.emit();
    this.close();
  }
}

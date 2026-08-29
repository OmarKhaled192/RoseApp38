import { inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';


type Severity = 'success' | 'info' | 'warn' | 'error' | 'secondary' | 'contrast';

@Injectable({
  providedIn: 'root',
})
export class Message {
  private messageService = inject(MessageService);
  private translate = inject(TranslateService);

  show(severity: Severity, detail: string, summary?: string) {
    this.messageService.add({
      key: 'main',
      severity,
      summary: summary
        ? this.translate.instant(summary)
        : this.translate.instant(`notifications.headers.${severity}`),
      detail: this.translate.instant(detail),
      life: 4500,
      closable: true,
    });
  }

}

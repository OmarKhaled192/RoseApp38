import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';


type Severity = 'success' | 'info' | 'warn' | 'error' | 'secondary' | 'contrast';

@Injectable({
  providedIn: 'root',
})
export class Message {
  private messageService = inject(MessageService);

  show(severity: Severity, detail: string) {
    this.messageService.add({ key: 'main', severity, detail });
  }

}

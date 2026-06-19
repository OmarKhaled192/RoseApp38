import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DarkModeService } from '../../services/dark-mode.service';

@Component({
  selector: 'lib-dark-mode',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dark-mode.component.html',
  styleUrls: ['./dark-mode.component.scss'],
})
export class DarkModeComponent {
  private readonly darkModeService = inject(DarkModeService);

  readonly isDark = this.darkModeService.isDark;

  toggle(): void {
    this.darkModeService.toggle();
  }
}

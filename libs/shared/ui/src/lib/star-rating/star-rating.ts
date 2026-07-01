import { Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'lib-star-rating',
  imports: [],
  template: `
  <div class="flex items-center gap-0.5">
    @for (star of stars(); track $index) {
     <button
      type="button"
      [class.cursor-pointer]="interactive()"
      [disabled]="!interactive()"
      class="focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded"
      (mouseenter)="interactive() && hover.emit($index + 1)"
      (mouseleave)="interactive() && hover.emit(0)"
      (click)="interactive() && rated.emit($index + 1)"
    >
      <svg xmlns="http://www.w3.org/2000/svg"
           class="w-3.5 h-3.5"
           [class.w-7]="interactive()" [class.h-7]="interactive()"
           [attr.fill]="star === 'full' ? '#f59e0b' : 'none'"
           viewBox="0 0 24 24"
           stroke="#f59e0b" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round"
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0
             00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0
             00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1
             1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1
             1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0
             00.951-.69l1.519-4.674z" />
      </svg>
    </button>
    }
  </div>
    `
})
export class StarRating {
  rating = input.required<number>();
  maxStars = input<number>(5);
  interactive = input<boolean>(false);
  hover = output<number>();
  rated = output<number>();
  stars = computed(() =>
    Array.from({ length: this.maxStars() }, (_, i) =>
      i < Math.round(this.rating()) ? 'full' : 'empty'
    )
  );
}

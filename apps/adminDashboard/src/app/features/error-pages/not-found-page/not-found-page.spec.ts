import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { NotFoundPage } from './not-found-page';

describe('NotFoundPage', () => {
  let fixture: ComponentFixture<NotFoundPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotFoundPage],
      providers: [provideRouter([]), provideTranslateService()],
    }).compileComponents();

    fixture = TestBed.createComponent(NotFoundPage);
    await fixture.whenStable();
  });

  it('should create a not found page with an illustration and home link', () => {
    const element = fixture.nativeElement as HTMLElement;

    expect(fixture.componentInstance).toBeTruthy();
    expect(element.querySelector('svg')).toBeTruthy();
    expect(element.querySelector('h1')?.textContent).toContain('errors.notFound.title');
    expect(element.querySelector('a')?.getAttribute('href')).toBe('/admin');
  });
});
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { UnauthorizedPage } from './unauthorized-page';

describe('UnauthorizedPage', () => {
  let fixture: ComponentFixture<UnauthorizedPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnauthorizedPage],
      providers: [provideRouter([]), provideTranslateService()],
    }).compileComponents();

    fixture = TestBed.createComponent(UnauthorizedPage);
    await fixture.whenStable();
  });

  it('should create an unauthorized page with a lock illustration and home link', () => {
    const element = fixture.nativeElement as HTMLElement;

    expect(fixture.componentInstance).toBeTruthy();
    expect(element.querySelector('svg')).toBeTruthy();
    expect(element.querySelector('h1')?.textContent).toContain('errors.unauthorized.title');
    expect(element.querySelector('a')?.getAttribute('href')).toBe('/admin');
  });
});
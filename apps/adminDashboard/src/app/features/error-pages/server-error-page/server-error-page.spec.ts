import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { ServerErrorPage } from './server-error-page';

describe('ServerErrorPage', () => {
  let fixture: ComponentFixture<ServerErrorPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServerErrorPage],
      providers: [provideRouter([]), provideTranslateService()],
    }).compileComponents();

    fixture = TestBed.createComponent(ServerErrorPage);
    await fixture.whenStable();
  });

  it('should create a server error page with retry and home actions', () => {
    const element = fixture.nativeElement as HTMLElement;

    expect(fixture.componentInstance).toBeTruthy();
    expect(element.querySelector('svg')).toBeTruthy();
    expect(element.querySelector('h1')?.textContent).toContain('errors.server.title');
    expect(element.querySelector('button')).toBeTruthy();
    expect(element.querySelector('a')?.getAttribute('href')).toBe('/admin');
  });
});
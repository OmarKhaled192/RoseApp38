import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, RouterModule } from '@angular/router';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { OccasionsList } from './occasions-list';

describe('OccasionsList', () => {
  let component: OccasionsList;
  let fixture: ComponentFixture<OccasionsList>;
  let translate: TranslateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OccasionsList, RouterModule],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        provideTranslateService({ lang: 'en', fallbackLang: 'en' }),
      ],
    }).compileComponents();

    translate = TestBed.inject(TranslateService);
    translate.setTranslation('en', {
      dashboard: {
        occasions: {
          title: 'All Occasions',
          addAction: 'Add a new occasion',
          searchPlaceholder: 'Search...',
          name: 'Name',
          products: 'Products',
          edit: 'Edit',
          delete: 'Delete',
          actions: 'Actions',
        },
      },
    });
    translate.use('en');

    fixture = TestBed.createComponent(OccasionsList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the page title and add action', () => {
    const title = fixture.nativeElement.querySelector('h1');
    expect(title?.textContent).toContain('All Occasions');

    const addAction = fixture.nativeElement.querySelector('a[routerLink="/admin/occasions/add"]');
    expect(addAction?.textContent).toContain('Add a new occasion');
  });
});

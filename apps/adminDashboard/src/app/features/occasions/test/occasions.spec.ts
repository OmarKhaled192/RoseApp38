import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, RouterModule } from '@angular/router';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { OccasionsList } from '../occasions-list';

describe('OccasionsList', () => {
  let component: OccasionsList;
  let fixture: ComponentFixture<OccasionsList>;

  beforeEach(async () => {
    const translate = new TranslateService();
    translate.setTranslation('en', {
      dashboard: {
        occasions: {
          title: 'All Occasions',
          addAction: 'Add a new occasion',
          searchPlaceholder: 'Search...',
          name: 'Name',
          products: 'Products',
          productsLabel: 'products',
          edit: 'Edit',
          delete: 'Delete',
          editLabel: 'Edit',
          deleteLabel: 'Delete',
          addTitle: 'Add a New Occasion',
          editTitle: 'Edit Occasion',
          addButton: 'Add Occasion',
          updateButton: 'Update Occasion',
        },
      },
    });
    translate.use('en');

    await TestBed.configureTestingModule({
      imports: [OccasionsList, RouterModule],
      providers: [
        provideRouter([]),
        provideTranslateService({ lang: 'en', fallbackLang: 'en' }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OccasionsList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page title and add form heading', () => {
    const title = fixture.nativeElement.querySelector('h1');
    expect(title?.textContent).toContain('All Occasions');
    const addHeading = fixture.nativeElement.querySelector('h2');
    expect(addHeading?.textContent).toContain('Add a New Occasion');
  });
});

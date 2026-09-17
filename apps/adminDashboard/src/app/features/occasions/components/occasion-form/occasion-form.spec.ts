import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { OccasionForm } from './occasion-form';

describe('OccasionForm', () => {
  let component: OccasionForm;
  let fixture: ComponentFixture<OccasionForm>;
  let translate: TranslateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OccasionForm],
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
          addTitle: 'Add a New Occasion',
          addButton: 'Add Occasion',
          editTitle: 'Edit Occasion',
          updateButton: 'Update Occasion',
        },
      },
    });
    translate.use('en');

    fixture = TestBed.createComponent(OccasionForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create in add mode', () => {
    expect(component).toBeTruthy();
    expect(component.mode()).toBe('add');
    expect(component.formTitle()).toBe('dashboard.occasions.addTitle');
  });

  it('should configure name and image fields', () => {
    expect(component.formFields().map((field) => field.key)).toEqual(['name', 'image']);
  });
});

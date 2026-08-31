import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { Breadcrumb } from './breadcrumb';

describe('Breadcrumb', () => {
  let component: Breadcrumb;
  let fixture: ComponentFixture<Breadcrumb>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Breadcrumb],
      providers: [
        provideRouter([
          { path: 'admin/overview', component: Breadcrumb },
          { path: 'admin/categories', component: Breadcrumb },
          { path: 'admin/occasions', component: Breadcrumb },
          { path: 'admin/products', component: Breadcrumb },
        ]),
        provideTranslateService(),
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(Breadcrumb);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize breadcrumb items with Dashboard', () => {
    expect(component.items).toBeDefined();
    expect(component.items.length).toBeGreaterThanOrEqual(1);
    expect(component.items[0].label).toBe('Dashboard');
    expect(component.items[0].routerLink).toBe('/admin/overview');
  });

  it('should sync breadcrumbs when navigating to categories sidebar route', async () => {
    await router.navigateByUrl('/admin/categories');
    component.updateBreadcrumb();
    expect(component.items.length).toBe(2);
    expect(component.items[0].label).toBe('Dashboard');
    expect(component.items[1].label).toBe('Categories');
  });

  it('should sync breadcrumbs when navigating to occasions sidebar route', async () => {
    await router.navigateByUrl('/admin/occasions');
    component.updateBreadcrumb();
    expect(component.items.length).toBe(2);
    expect(component.items[0].label).toBe('Dashboard');
    expect(component.items[1].label).toBe('Occasions');
  });

  it('should sync breadcrumbs when navigating to products sidebar route', async () => {
    await router.navigateByUrl('/admin/products');
    component.updateBreadcrumb();
    expect(component.items.length).toBe(2);
    expect(component.items[0].label).toBe('Dashboard');
    expect(component.items[1].label).toBe('Products');
  });
});

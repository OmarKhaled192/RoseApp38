import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubNav } from './sub-nav';

describe('SubNav', () => {
  let component: SubNav;
  let fixture: ComponentFixture<SubNav>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubNav],
    }).compileComponents();

    fixture = TestBed.createComponent(SubNav);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

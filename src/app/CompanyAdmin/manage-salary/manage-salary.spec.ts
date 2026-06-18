import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageSalary } from './manage-salary';

describe('ManageSalary', () => {
  let component: ManageSalary;
  let fixture: ComponentFixture<ManageSalary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageSalary]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageSalary);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEmployeeDialog } from './add-employee-dialog';

describe('AddEmployeeDialog', () => {
  let component: AddEmployeeDialog;
  let fixture: ComponentFixture<AddEmployeeDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEmployeeDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEmployeeDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

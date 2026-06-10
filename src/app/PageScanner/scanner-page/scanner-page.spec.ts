import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScannerPage } from './scanner-page';

describe('ScannerPage', () => {
  let component: ScannerPage;
  let fixture: ComponentFixture<ScannerPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScannerPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScannerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

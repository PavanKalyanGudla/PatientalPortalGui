import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorAfterLoginComponent } from './doctor-after-login.component';

describe('DoctorAfterLoginComponent', () => {
  let component: DoctorAfterLoginComponent;
  let fixture: ComponentFixture<DoctorAfterLoginComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DoctorAfterLoginComponent]
    });
    fixture = TestBed.createComponent(DoctorAfterLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

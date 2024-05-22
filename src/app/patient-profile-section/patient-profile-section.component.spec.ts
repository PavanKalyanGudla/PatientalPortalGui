import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientProfileSectionComponent } from './patient-profile-section.component';

describe('PatientProfileSectionComponent', () => {
  let component: PatientProfileSectionComponent;
  let fixture: ComponentFixture<PatientProfileSectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PatientProfileSectionComponent]
    });
    fixture = TestBed.createComponent(PatientProfileSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

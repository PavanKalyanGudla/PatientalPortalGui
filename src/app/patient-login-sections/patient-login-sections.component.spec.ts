import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientLoginSectionsComponent } from './patient-login-sections.component';

describe('PatientLoginSectionsComponent', () => {
  let component: PatientLoginSectionsComponent;
  let fixture: ComponentFixture<PatientLoginSectionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PatientLoginSectionsComponent]
    });
    fixture = TestBed.createComponent(PatientLoginSectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientalPortalManagementComponent } from './patiental-portal-management.component';

describe('PatientalPortalManagementComponent', () => {
  let component: PatientalPortalManagementComponent;
  let fixture: ComponentFixture<PatientalPortalManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PatientalPortalManagementComponent]
    });
    fixture = TestBed.createComponent(PatientalPortalManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

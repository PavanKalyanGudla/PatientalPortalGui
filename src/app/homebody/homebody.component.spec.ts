import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomebodyComponent } from './homebody.component';

describe('HomebodyComponent', () => {
  let component: HomebodyComponent;
  let fixture: ComponentFixture<HomebodyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HomebodyComponent]
    });
    fixture = TestBed.createComponent(HomebodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

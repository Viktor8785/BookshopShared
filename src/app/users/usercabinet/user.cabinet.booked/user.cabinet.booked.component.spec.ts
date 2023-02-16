import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCabinetBookedComponent } from './user.cabinet.booked.component';

describe('UserCabinetBookedComponent', () => {
  let component: UserCabinetBookedComponent;
  let fixture: ComponentFixture<UserCabinetBookedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserCabinetBookedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserCabinetBookedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

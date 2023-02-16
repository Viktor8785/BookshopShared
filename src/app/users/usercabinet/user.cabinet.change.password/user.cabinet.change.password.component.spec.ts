import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCabinetChangePasswordComponent } from './user.cabinet.change.password.component';

describe('UserCabinetChangePasswordComponent', () => {
  let component: UserCabinetChangePasswordComponent;
  let fixture: ComponentFixture<UserCabinetChangePasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserCabinetChangePasswordComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserCabinetChangePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCabinetChangeEmailComponent } from './user.cabinet.change.email.component';

describe('UserCabinetChangeEmailComponent', () => {
  let component: UserCabinetChangeEmailComponent;
  let fixture: ComponentFixture<UserCabinetChangeEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserCabinetChangeEmailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserCabinetChangeEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCabinetViewedComponent } from './user.cabinet.viewed.component';

describe('UserCabinetViewedComponent', () => {
  let component: UserCabinetViewedComponent;
  let fixture: ComponentFixture<UserCabinetViewedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserCabinetViewedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserCabinetViewedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

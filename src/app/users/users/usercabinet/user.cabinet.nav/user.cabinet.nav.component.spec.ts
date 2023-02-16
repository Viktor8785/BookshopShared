import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCabinetNavComponent } from './user.cabinet.nav.component';

describe('UserCabinetNavComponent', () => {
  let component: UserCabinetNavComponent;
  let fixture: ComponentFixture<UserCabinetNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserCabinetNavComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserCabinetNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

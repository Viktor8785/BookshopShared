import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCabinetSetPersonaldataComponent } from './user.cabinet.set.personaldata.component';

describe('UserCabinetSetPersonaldataComponent', () => {
  let component: UserCabinetSetPersonaldataComponent;
  let fixture: ComponentFixture<UserCabinetSetPersonaldataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserCabinetSetPersonaldataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserCabinetSetPersonaldataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsercabinetComponent } from './usercabinet.component';

describe('UsercabinetComponent', () => {
  let component: UsercabinetComponent;
  let fixture: ComponentFixture<UsercabinetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsercabinetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsercabinetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

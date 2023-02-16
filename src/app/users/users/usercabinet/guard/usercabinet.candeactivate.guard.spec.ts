import { TestBed } from '@angular/core/testing';

import { usercabinetCanDeactivateGuard } from './usercabinet.candeactivate.guard';

describe('UsercabinetCanDeactivateGuard', () => {
  let guard: usercabinetCanDeactivateGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(usercabinetCanDeactivateGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { adminCanloadGuard } from './admin.canload.guard';

describe('adminCanloadGuard', () => {
  let guard: adminCanloadGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(adminCanloadGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

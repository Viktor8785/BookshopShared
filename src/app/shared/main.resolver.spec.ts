import { TestBed } from '@angular/core/testing';

import { mainResolver } from './main.resolver';

describe('MainResolver', () => {
  let resolver: mainResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(mainResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
